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
		wp_enqueue_style( 'main', get_template_directory_uri() . "/style.css", array(), '1.0.1');
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'tmpl', get_template_directory_uri() . "/js/scripts.js", array(), '1.0.1');
	}
	add_action( 'wp_enqueue_scripts', 'ths_scripts' );
?>