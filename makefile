

install:
	bower install
	npm install
	gulp default
	sudo rm -rf /var/www/html/*
	sudo cp -r dist/* /var/www/html
	echo "Done!"
