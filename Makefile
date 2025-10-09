# Variables
DOCKER_COMPOSE = docker-compose
PROJECT_NAME = fullmerge

# Services
SERVICES = frontend auth-service chat-service dashboard-service db-service ping-pong-service parcheesi-service user-service
MONITORING = prometheus grafana

# ------------------------
# Main commands
# ------------------------

.PHONY: build up down logs restart clean ps

## Build all services
build:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) build

## Start all services in detached mode
up:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) up -d

## Stop all running services
down:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) down

## Restart all services
restart: down up

## Show running containers
ps:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) ps

## View logs (all)
logs:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) logs -f

## View logs of a specific service (ex: make logs s=frontend)
logs-%:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) logs -f $*

## Remove all containers, networks, volumes
clean:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) down -v --remove-orphans

# ------------------------
# Individual services
# ------------------------

## Build a specific service (ex: make build-frontend)
build-%:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) build $*

## Start a specific service (ex: make up-frontend)
up-%:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) up -d $*

## Restart a specific service (ex: make restart-frontend)
restart-%:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) restart $*

## Stop a specific service (ex: make stop-frontend)
stop:
	$(DOCKER_COMPOSE)  stop
# 	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) stop $*

fclean: down
	 docker system prune -a -f --volumes 