<?php
	if (function_exists('add_theme_support')) {
		add_theme_support('menus');
		add_theme_support('post-thumbnails');
		add_theme_support('custom-logo', array(
			'height'      => 116,
			'width'       => 97,
			'flex-height' => true,
			'flex-width'  => true,
		));
	}
	function ths_scripts() {
		$package = json_decode(file_get_contents(get_template_directory() . "/package.json"), 1);
		wp_enqueue_style( 'main', get_template_directory_uri() . "/style.css", array(), $package["version"]);
		wp_enqueue_style( 'addition', get_template_directory_uri() . "/css/styles.css", array(), $package["version"]);
		wp_enqueue_script( 'script', get_template_directory_uri() . "/js/scripts.js", array(), $package["version"]);
	}
	add_action( 'wp_enqueue_scripts', 'ths_scripts' );
?>