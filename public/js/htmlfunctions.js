function changeBrushCheckboxLabel() {
	let checkbox = document.getElementById("brushToggle");
	let label = document.getElementById("brushToggleLabel");
	if (checkbox.checked) {
		label.style.color = "red";
		label.innerHTML = "On";
	} else {
		label.style.color = "black";
		label.innerHTML = "Off";
	}
}

function changeBrushSliderLabel() {
	let slider = document.getElementById("brushSlider");
	let label = document.getElementById("brushSliderLabel");
	label.innerHTML = slider.value;
}