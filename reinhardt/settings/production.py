from reinhardt.settings.base import *

DEBUG = False

INSTALLED_APPS += ('mod_wsgi.server',)

BASE_URL="/rubato"

LOGIN_URL = BASE_URL + "/login/"

STATIC_ROOT = '/usr/local/apache2/htdocs/static/'

