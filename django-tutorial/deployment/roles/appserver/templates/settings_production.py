try:
    from settings import *
except ImportError:
    pass

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '{{ database.name }}',
        'USER': '{{ database.user }}',
        'PASSWORD': '{{ database.password }}',
        'HOST': '{{ database.host }}',
        'PORT': '{{ database.port }}',
    }
}
