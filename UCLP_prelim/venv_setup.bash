python3 -m venv env
source env/bin/activate
brew install python@3.8
python3 -m pip install jupyter pandas earthengine-api
python3 -m pip freeze > requirements.txt