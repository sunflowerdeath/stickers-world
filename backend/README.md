# Backend

Stickers World backend is a Node.js app with sql database.
Deployment of the app is configured with kubernetes.

## Development workflow

For development you can run local kubernetes cluster using minikubes.

Development app container doesn't include its source code, instead of this 
it mounts directory from the host machine into the container.
Also, it runs app using `nodemon` for restarting app on file changes.

Some useful commands:

1. Start minikube
```sh
# Start minikube
minikube start
# Set context
kubectl config use-context minikube
# Set minikube as docker host
eval $(minikube docker-env)
# Mount app directory to the minikube virtual machine
minikube mount .:/stickers-world-backend-dev &
# Stop mount job
kill $(jobs -p)
```

2. Build docker image and create kubernetes config (you need to do it only once)
```sh
# Create kubernetes config
kubectl create -f kubernetes-config/dev/ --save-config
# Build development docker image
docker build -f Dockerfile.dev -t stickers-world-dev:latest .
# Force pull new image, if you needed to rebuild it for some reason
kubectl delete pods -l='app=node'
```

3. View logs
```sh
# Show app url
minikube service node --url
# View previous logs
kubectl logs `kubectl get pods -l='app=node' -o=name`
# Stream logs
kubectl attach `kubectl get pods -l='app=node' -o=name`
```

## Google cloud

```sh
# Set default project
gcloud config set project stickers-world
gcloud config set compute/zone us-central1-a

# Authenticate to the cluster
gcloud auth application-default login

# Create cluster
gcloud beta container clusters create "galaxy" --zone "us-central1-a" --cluster-version "1.7.2" --machine-type "g1-small" --disk-size "10" --num-nodes "1"

# Create persistent disk
gcloud compute disks create mysql-disk --size 1

# Set the default cluster for gcloud container commands
gcloud config set container/cluster galaxy

# Tell kubectl which cluster to target
gcloud container clusters get-credentials galaxy --zone us-central1-a

# Working with registry
docker tag [IMAGE_ID] gcr.io/stickers-world/node:v1
gcloud docker -- push gcr.io/stickers-world/node:v1
gcloud container images list --repository=gcr.io/stickers-world
```
