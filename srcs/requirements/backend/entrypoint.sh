#!/bin/bash
set -e
VPS_ENV="dev"

cp /requirements.txt /BACKEND

mkdir -p /var/log/supervisord
rm -rf /var/log/supervisor
touch /var/log/supervisord/runserver.log
touch /var/log/supervisord/runserver_error.log
# touch /var/log/supervisord/gunicorn.log
# touch /var/log/supervisord/gunicorn_error.log
# touch /var/log/supervisord/celery_worker.log
# touch /var/log/supervisord/celery_worker_error.log
# touch /var/log/supervisord/celery_beat.log
# touch /var/log/supervisord/celery_beat_error.log
chown -R user:user /var/log/supervisord
chmod -R 755 /var/log/supervisord
# chmod +x /root/venv/bin/gunicorn
chmod +x /root/venv/bin/python3
chmod 755 / /root /root/venv /root/venv/bin && \
    chmod +x /root/venv/bin/python3 && \
    # chmod +x /root/venv/bin/gunicorn
chmod -R 777 /var/log
chmod -R 777 /root/venv
chmod -R 777 /root/venv/bin
# chmod -R 777 /BACKEND

# # Seleziona l'ambiente di esecuzione
# # if [ "$VPS_ENV" = "dev" ]; then
#     echo "Starting in development mode..."
#     supervisord -c /etc/supervisor/conf.d/supervisord.dev.conf
# # else
#     echo "Set your VPS_ENV. Not found"
#     sleep infinity
# # fi

# /root/venv/bin/python /BACKEND/django_transcendence/manage.py migrate
/root/venv/bin/python /BACKEND/django_transcendence/manage.py runserver 0.0.0.0:8000
