########## TARGETS ##########
# indicates targets not associated with actual files
.PHONY: all start build down stop restart-container clean fclean re remove-imgs full-reset \
		backend backend-build backend-up backend-rebuild backend-debug backend-check-migrate backend-migrate \
		backend-venv backend-own backend-echo \
		database-login database-rebuild \
		grafana-insert grafana-retrieve \
		git-push git-reset git-remove-cache

# suppress command output for better readability
.SILENT:


########## VARIABLES ##########
# project and compose settings
PROJECT_NAME = ft_transcendence
COMPOSE_PATH = srcs/docker-compose.yml
USER = ${shell id -un} # detect current user dynamically

# OS decetion and compose command
UNAME_S := ${shell uname -s}
ifeq (${UNAME_S}, Darwin) # MacOS
    COMPOSE = docker-compose
	ADJUST_REQ = cp os-specific/requirements.mac.txt requirements.txt
else ifeq (${UNAME_S}, Linux) # Linux
	ifeq (${shell test -d /nfs/homes/ && echo -n yes},yes)
		COMPOSE = /nfs/homes/${USER}/sgoinfre/bin/docker compose
	else
		COMPOSE = sudo docker compose
	endif
	ADJUST_REQ = cp os-specific/requirements.ubuntu.txt requirements.txt
endif

# docker volumes for cleanup
DOCKER_VOLUMES= Transcendence_backend_volume Transcendence_elasticsearch_volume \
				Transcendence_filebeat_volume Transcendence_grafana_volume Transcendence_postgres_volume\
				Transcendence_prometheus_volume


########## RULES ##########
### general/docker ###
OS := $(shell uname)

all: build collect
ifeq ($(OS), Darwin)  # macOS
	@echo "Rilevato macOS. Avvio Docker Desktop..."
	#open -a Docker
else ifeq ($(OS), Linux)  # Linux
	@echo "Rilevato Linux. Avvio il servizio Docker..."
	-@sudo service docker start
else
	@echo "Sistema operativo non supportato!"
	exit 1
endif

start:
	-@sudo service docker start

createfolders:
	@mkdir data/elasticsearch-storage data/BACKEND  data/Transcendence_DB data/filebeat-data  data/grafana-storage | true
	@sudo chown -R root:root srcs/filebeat.yml | true

build:
	@echo "${WHITE}Welcome to ${MAGENTA}${PROJECT_NAME} 🏓${DEF_COLOR}\n"
	sleep 1
	${ADJUST_REQ}
	@echo "----------\n"\
	"${RED}Detecting OS...${WHITE} Seems like you're on ${GREEN}${UNAME_S}${WHITE}!\n"\
	"Adjusting Makefile and requirements.txt to make sure everything runs smoothly.\n"\
	"${YELLOW}It'll just take a sec ;P${DEF_COLOR}\n"\
	"----------\n"
	sleep 1
	${COMPOSE} -f ${COMPOSE_PATH} -p ${PROJECT_NAME} up --build -d

down:
	${COMPOSE} -f ${COMPOSE_PATH} -p ${PROJECT_NAME} down

stop:
	docker stop ${docker ps -q}

restart-container:
	@read -p "${CYAN}Enter the service name to restart: ${DEF_COLOR}" service_name; \
	if docker compose -f ${COMPOSE_PATH} ps --services | grep -qw "$$service_name"; then \
		@echo "${GREEN}Restarting service: $$service_name...${DEF_COLOR}"; \
		docker compose -f ${COMPOSE_PATH} rm -f $$service_name; \
		docker compose -f ${COMPOSE_PATH} up -d --no-deps $$service_name; \
		@echo "${YELLOW}Service $$service_name restarted successfully.${DEF_COLOR}"; \
	else \
		@echo "${RED}Error: Service '$$service_name' does not exist.${DEF_COLOR}"; \
	fi

clean: down
	@echo "${YELLOW}Cleaning up containers, networks, and volumes...${DEF_COLOR}"
	@if [ -n "$$(docker ps -a -q)" ]; then docker rm $$(docker ps -a -q); fi
	docker network prune -f
	docker volume rm ${DOCKER_VOLUMES}

full-reset:
	docker system prune -a --volumes

fclean: down
	@echo "${RED}Performing a full reset, including system prune.${DEF_COLOR}"
	@if [ -n "$$(docker ps -a -q)" ]; then docker rm $$(docker ps -a -q); fi
	docker network prune -f
	docker system prune -a --volumes
	docker volume rm ${DOCKER_VOLUMES}

re:
	${COMPOSE} -f ${COMPOSE_PATH} -p ${PROJECT_NAME} restart backend

collect:
	${COMPOSE} -f ${COMPOSE_PATH} -p ${PROJECT_NAME} exec backend /root/venv/bin/python BACKEND/django_transcendence/manage.py collectstatic --noinput --clear

ps:
	${COMPOSE} -f ${COMPOSE_PATH} -p ${PROJECT_NAME} ps

remove-imgs:
	docker rmi ${docker images -q}

### backend ###
backend: backend-build backend-up

backend-build:
	${COMPOSE} -f ${COMPOSE_PATH} build --progress plain backend

backend-up:
	${COMPOSE} -f ${COMPOSE_PATH} up -d backend

backend-rebuild:
	${COMPOSE} -f ${COMPOSE_PATH} stop backend && \
	${COMPOSE} -f ${COMPOSE_PATH} rm -f backend && \
	${COMPOSE} -f ${COMPOSE_PATH} build backend && \
	${COMPOSE} -f ${COMPOSE_PATH} up -d backend

backend-debug:
	docker run -it --entrypoint bash -v ~/$(PROJECT_NAME)/data/BACKEND:/django srcs-backend

backend-check-migrate:
	docker exec -it backend /root/venv/bin/python3 /${BACKEND_DIR}/${PROJECT_NAME}/manage.py makemigrations

backend-migrate:
	docker exec -it backend /root/venv/bin/python3 /${BACKEND_DIR}/${PROJECT_NAME}/manage.py migrate

backend-venv:
	@source ~/${PROJECT_NAME}/data/BACKEND/venv/bin/activate

backend-own:
	sudo chown -R $(USER): ~/${PROJECT_NAME}/data/BACKEND

backend-echo:
	@echo ${BACKEND_DIR}


### database ###
database-login:
	@echo "${GREEN}Logging into PostgreSQL database...${DEF_COLOR}"
	docker exec -it postgres bash psql -U ft_transcendence -d TRANSCENDENCE

database-rebuild:
	@echo "${YELLOW}Database container rebuilt successfully.${DEF_COLOR}"
	docker compose -f ./${COMPOSE_PATH} build --progress plain postgres && docker compose -f ./${COMPOSE_PATH} up -d postgres

### grafana ###
grafana-insert:
	@echo "${RED}This will overwrite the current Grafana database. Type YES to confirm:${DEF_COLOR}"
	@read confirmation && [ "$$confirmation" = "YES" ] || (echo "${YELLOW}Operation cancelled.${DEF_COLOR}" && exit 1)
	chmod 777 ./grafana.db
	docker cp ./grafana.db grafana:/var/lib/grafana/grafana.db
	docker restart grafana
	@echo "${GREEN}Database successfully inserted and container restarted.${DEF_COLOR}"

grafana-retrieve:
	@GRAFANA_TOKEN=$$(grep GRAFANA_TOKEN ./srcs/.env | cut -d '=' -f2) ;\
	docker cp grafana:/var/lib/grafana/grafana.db ./grafana.db ;\
	@echo "${GREEN}Current database retrieved and saved as ./grafana.db${DEF_COLOR}"

### git ###
git-push:
	@git add . && \
	@git commit -m fastpush && \
	@git push

git-reset:
	@git reset --hard origin/master

git-remove-cache:
	@git rm -r --cached .


######### COLORS ##########
DEF_COLOR = \033[0;39m
BLACK = \033[1;90m
RED = \033[1;91m
GREEN = \033[1;92m
YELLOW = \033[1;93m
BLUE = \033[1;94m
MAGENTA = \033[1;95m
CYAN = \033[1;96m
WHITE = \033[1;97m
