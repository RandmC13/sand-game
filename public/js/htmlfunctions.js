function changeBrushSliderLabel() {
	let slider = document.getElementById("brushSlider");
	let label = document.getElementById("brushSliderLabel");
	label.innerHTML = slider.value;
}