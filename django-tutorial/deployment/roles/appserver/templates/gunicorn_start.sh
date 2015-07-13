#!/bin/bash
 
NAME="django-tutorial"
echo "Starting $NAME as `whoami`"
 
source {{ webapp.virtualenv }}/bin/activate

DJANGODIR={{ webapp.root }}
SOCKFILE={{ webapp.root }}/gunicorn.sock
USER={{ webapp.user }}
GROUP={{ webapp.group }}
NUM_WORKERS=1
export DJANGO_SETTINGS_MODULE=mysite.settings_production
export DJANGO_WSGI_MODULE=mysite.wsgi
export PYTHONPATH=$DJANGODIR:$PYTHONPATH 

cd $DJANGODIR
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR
 
exec {{ webapp.virtualenv }}/bin/gunicorn \
  ${DJANGO_WSGI_MODULE}:application --name $NAME \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=0.0.0.0:{{ webapp.port }} \
  --log-level=info --log-file=-
