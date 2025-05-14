FROM debian:bookworm

# Installazione di base
RUN apt-get update && apt-get install -y bash python3 python3-venv python3-pip openssl supervisor procps

# Creazione ambiente virtuale
RUN python3 -m venv /root/venv

ENV PYTHONPATH=/BACKEND

# Creazione utente non root
ARG UID=1000
ARG GID=1000
RUN groupadd -g $GID user && useradd -m -u $UID -g $GID user
RUN mkdir -p /BACKEND && chown -R 1000:1000 /BACKEND

# Installazione pacchetti Python
COPY requirements.txt ./
RUN /root/venv/bin/pip install -r requirements.txt
RUN apt-get update && apt-get install -y postgresql-client


RUN echo "source /root/venv/bin/activate" >> /root/.bashrc

# Copia configurazioni e script
COPY entrypoint.sh /entrypoint.sh
COPY supervisord.dev.conf /etc/supervisor/conf.d/supervisord.dev.conf


RUN chmod +x /entrypoint.sh && chown 1000:1000 /entrypoint.sh

# Entrypoint
ENTRYPOINT ["/entrypoint.sh"]
