FROM spacifici/fennec:66.0.3

RUN apt-get update && \
    apt-get install -y \
    python-pip && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ARG UID
ARG GID
ARG USER
ENV SHELL=/bin/bash

RUN getent group $GID || groupadd $USER --gid $GID && \
    useradd --create-home --shell /bin/bash $USER --uid $UID --gid $GID

USER $USER
SHELL ["/bin/bash", "-l", "-c"]

RUN pip install awscli --upgrade --user