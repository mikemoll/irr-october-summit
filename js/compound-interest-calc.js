function calcCompound()
{
    p = document.getElementById("p").value;
    n = document.getElementById("n").value; // no. of compoundings per year
    t = document.getElementById("t").value; // no. of years
    r = document.getElementById("r").value;
    totalAmountCalculated = document.getElementById("totalAmountCalculated");
    InterestCalculated = document.getElementById("InterestCalculated");
    // The equation is A = p * [[1 + (r/n)] ^ nt]
    A = (p * Math.pow((1 + (r / (n * 100))), (n * t)));
    // toFixed is used for rounding the amount with two decimal places.
    totalAmountCalculated.innerHTML = number_format(A.toFixed(2));
    InterestCalculated.innerHTML = number_format((A.toFixed(2) - p).toFixed(2));
}
var ps = document.getElementById("p");
var pv = document.getElementById("pv");
pv.innerHTML = ps.value; // Display the default slider value
calcCompound();

// Update the current slider value (each time you drag the slider handle)
ps.oninput = function () {
    pv.innerHTML = number_format(this.value);
    calcCompound();
}
var ns = document.getElementById("n");
var nv = document.getElementById("nv");
nv.innerHTML = ns.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
ns.oninput = function () {
    nv.innerHTML = number_format(this.value);
    calcCompound();
}
var tr = document.getElementById("t");
var tv = document.getElementById("tv");
tv.innerHTML = tr.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
tr.oninput = function () {
    tv.innerHTML = number_format(this.value);
    calcCompound();
}
var sr = document.getElementById("r");
var rv = document.getElementById("rv");
rv.innerHTML = sr.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sr.oninput = function () {
    rv.innerHTML = number_format(this.value);
    calcCompound();
}