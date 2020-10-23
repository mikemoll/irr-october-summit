function calSimple()
{
    p = document.getElementById("p2").value;
    n = document.getElementById("n2").value;
    r = document.getElementById("r2").value;
    InterestCalculated2 = document.getElementById("InterestCalculated2");
    InterestCalculated2.innerHTML = number_format(p * n * r / 100);
}
var ps2 = document.getElementById("p2");
var pv2 = document.getElementById("pv2");
pv2.innerHTML = ps2.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
ps2.oninput = function () {
    pv2.innerHTML = number_format(this.value);
    calSimple();
}
var nr2 = document.getElementById("n2");
var nv2 = document.getElementById("nv2");
nv2.innerHTML = nr2.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
nr2.oninput = function () {
    nv2.innerHTML = number_format(this.value);
    calSimple();
}
var rs2 = document.getElementById("r2");
var rv2 = document.getElementById("rv2");
rv2.innerHTML = rs2.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
rs2.oninput = function () {
    rv2.innerHTML = number_format(this.value);
    calSimple();
}
calSimple();