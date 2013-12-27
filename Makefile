BIN = node_modules/.bin
JS_SRC = js/vendor/jquery.jcountdown.js js/plugins.js js/main.js
JS_OUTPUT = js/bundle.min.js
CSS_SRC = css/icon-fonts.css css/style.css
CSS_OUTPUT = css/bundle.min.css

# Minify javascript and css files and generate bundled files.
assets:
	$(BIN)/uglifyjs $(JS_SRC) -o $(JS_OUTPUT) -c -m
	cat $(CSS_SRC) | $(BIN)/cleancss -o $(CSS_OUTPUT)
