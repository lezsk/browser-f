/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/**
 * Test that when opening a private browsing window and typing in it before about:privatebrowsing
 * loads, we don't clear the URL bar.
 */
add_task(async function() {
  let urlbarTestValue = "Mary had a little lamb";
  let win = OpenBrowserWindow({private: true});
  await BrowserTestUtils.waitForEvent(win, "load");
  let urlbar = win.document.getElementById("urlbar");
  urlbar.value = urlbarTestValue;
  // Need this so the autocomplete controller attaches:
  let focusEv = new FocusEvent("focus", {});
  urlbar.dispatchEvent(focusEv);
  // And so we know input happened:
  let inputEv = new InputEvent("input", {data: "", view: win, bubbles: true});
  urlbar.inputField.dispatchEvent(inputEv);
  // Check it worked:
  is(urlbar.value, urlbarTestValue, "URL bar value should be there");
  is(win.gBrowser.selectedBrowser.userTypedValue, urlbarTestValue, "browser object should know the url bar value");

  let continueTest;
  let continuePromise = new Promise(resolve => continueTest = resolve);
  let wpl = {
    onLocationChange(aWebProgress, aRequest, aLocation) {
      if (aLocation && aLocation.spec == "about:privatebrowsing") {
        continueTest();
      }
    },
  };
  win.gBrowser.addProgressListener(wpl);

  await continuePromise;
  is(urlbar.value, urlbarTestValue,
     "URL bar value should be the same once about:privatebrowsing has loaded");
  is(win.gBrowser.selectedBrowser.userTypedValue, urlbarTestValue,
     "browser object should still know url bar value once about:privatebrowsing has loaded");
  win.gBrowser.removeProgressListener(wpl);
  await BrowserTestUtils.closeWindow(win);
});
