
function getGoogleMapUrl(item) {
    var mapsAPI = "AIzaSyBctSn5FcMB_iQv_AnvogZVjjrKhcZyzGI";
    var addr = (item.StreetNumber || '') + ' ' + (item.StreetName || '') + ' ' + (item.City || '') + ' ' + (item.Province || '') + ' ' + (getCountryName(item.Country) || '') + ' ' + (item.PostalCode || '');
    console.log('addr: ', addr);

    var url = "https://www.google.com/maps/embed/v1/place?q=" + encodeURI(addr) + "&key=" + mapsAPI;
    return url;
    //                https://www.google.com/maps/embed/v1/place?q=673%20abbott%20street%2C%20bc%20vancouver&key=AIzaSyBctSn5FcMB_iQv_AnvogZVjjrKhcZyzGI
}

function getGoogleMapUrlNew(item) {
    var mapsAPI = "AIzaSyBctSn5FcMB_iQv_AnvogZVjjrKhcZyzGI";
    var addr = (item.streetNumber || '') + ' ' + (item.address || '') + ' ' + (item.city || '') + ' ' + (item.province || '') + ' ' + (item.country || '') + ' ' + (item.postalCode || '');
    console.log('addr: ', addr);

    var url = "https://www.google.com/maps/embed/v1/place?q=" + encodeURI(addr) + "&key=" + mapsAPI;
    return url;
    //                https://www.google.com/maps/embed/v1/place?q=673%20abbott%20street%2C%20bc%20vancouver&key=AIzaSyBctSn5FcMB_iQv_AnvogZVjjrKhcZyzGI
}
/** Returns the HTML for the properties cards
 *
 * @param {type} list
 * @param {type} page [marketplace|profile]
 * @returns {String}
 */
function renderPropertyCards(list, page) {
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    if (page === 'newdeal-prop' || page === 'myproperties') {
        cardsHtml += getNewButton('Add Property', '/addproperty');
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        let OwnerID = item.Owner.slice(31);
        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6">';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + item.PropertySPVID + '" class="carousel slide" data-ride="carousel">';
        var active = 'active';
        var photos = '';
        var indicators = '';
        if (item.Photos.length == 0) {
            item.Photos.push({ "ImageFile": '/img/p10.jpg' });
        }
        for (j = 0; j < item.Photos.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (item.Photos.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item.PropertySPVID + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + item.Photos[j].ImageFile + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += indicators;
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += photos;
        cardsHtml += '                </div>';
        if (item.Photos.length > 1) {
            cardsHtml += '               <a class="carousel-control-prev" href="#carouselIndicators' + item.PropertySPVID + '" data-slide="prev">';
            cardsHtml += '                   <span class="carousel-control-prev-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Previous</span>';
            cardsHtml += '               </a>';
            cardsHtml += '               <a class="carousel-control-next" href="#carouselIndicators' + item.PropertySPVID + '" data-slide="next">';
            cardsHtml += '                   <span class="carousel-control-next-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Next</span>';
            cardsHtml += '               </a>';
        }
        cardsHtml += '            </div>';

        var statusColor = '';
        if (item.Rejected) {
            statusColor = 'card-property-status-rejected';
        } else
            if (item.Listed) {
                statusColor = 'card-property-status-listed';
            } else {
                statusColor = 'card-property-status-pending';
            }
        if (item.isWaitlist) {
            cardsHtml += '              <span class="card-property-status ' + statusColor + '">Coming Soon</span>';
        } else if (page === 'marketplace' && page !== 'deals') {
            cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.EndDate) + ' days left</span>';
        } else {
            cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + item.Status + '</span>';
        }
        cardsHtml += '        </div>';
        cardsHtml += '        <div class="card-body">';
        cardsHtml += '            <a class="card-fab box-shadow-shallow" href="/properties/' + item.PropertySPVID + '"><span>i</span></a> ';
        cardsHtml += '            <p class="card-price float-right pt-4">$' + number_format(item.AskingPrice, 2) + '</p>';
        cardsHtml += '            <p class="card-title"><a class="" href="/properties/' + item.PropertySPVID + '">' + item.PropertyName + '</a></p>';
        cardsHtml += '            <p class="card-text">' + item.StreetNumber + ' ' + item.StreetName + '<br>' + item.City + ', ' + getCountryName(item.Country) + '</p>';
        cardsHtml += '            <hr class="card-hr">';
        cardsHtml += '            <div class="d-flex justify-content-between align-items-center">';
        cardsHtml += '                <div class="card-amenity text-center">';
        cardsHtml += '                      <div class="card-amenity-text">Bed</div>';
        cardsHtml += '                      <div class="card-amenity-icon">';
        cardsHtml += '                          <img class="" src="/img/icon/bed-icon.png" alt="">';
        cardsHtml += '                      </div>';
        cardsHtml += '                      <div class="card-amenity-value">' + item.Bedrooms + '</div>';
        cardsHtml += '                  </div>';
        cardsHtml += '                  <div class="card-amenity text-center">';
        cardsHtml += '                     <div class="card-amenity-text">Bath</div>';
        cardsHtml += '                     <div class="card-amenity-icon">';
        cardsHtml += '                         <img class="" src="/img/icon/bath-icon.png" alt="">';
        cardsHtml += '                     </div>';
        cardsHtml += '                     <div class="card-amenity-value">' + item.Bathrooms + '</div>';
        cardsHtml += '                 </div>';
        cardsHtml += '                 <div class="card-amenity text-center">';
        cardsHtml += '                     <div class="card-amenity-text">Size</div>';
        cardsHtml += '                     <div class="card-amenity-icon">';
        cardsHtml += '                         <img class="" src="/img/icon/size-icon.png" alt="">';
        cardsHtml += '                     </div>';
        cardsHtml += '                     <div class="card-amenity-value">' + item.SquareFeet + ' sqft</div>';
        cardsHtml += '                 </div>';
        cardsHtml += '              </div>';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons pt-4">';
        if (page === 'newdeal-prop') {
            cardsHtml += '              <a class="btn btn-xs btn-success" href="/newdeal-details/Property/' + item.PropertySPVID + '"><i class="fa fa-check  "></i> Select</a>';

        } else {
            cardsHtml += '              <a class="btn btn-sm btn-info" href="/properties/' + item.PropertySPVID + '"><i class="far fa-file"></i> Details</a>';
            if (page === 'marketplace' && OwnerID !== currentId) {
                cardsHtml += '              <a class=" " href="/buyshare/' + item.PropertySPVID + '"><i class="fa fa-money-check-alt"></i> Invest</a>';
            }
            if (page !== 'marketplace') {
                cardsHtml += '            <div class="dropdown dropdown--hover">';
                cardsHtml += '                <span class="dropdown__trigger">Actions<i class="stack-down-open"></i></span>';
                cardsHtml += '                <div class="dropdown__container">';
                cardsHtml += '                    <div class="container">';
                cardsHtml += '                        <div class="row">';
                cardsHtml += '                            <div class="col-md-3 col-lg-2 dropdown__content">';
                cardsHtml += '                                <ul class="menu-vertical">';
                if (item.Status !== 'Listed') {
                    cardsHtml += '                                    <li>';
                    cardsHtml += '              <a class=" " href="/updateproperty/' + item.PropertySPVID + '">Edit Property</a>';
                    cardsHtml += '                                    </li>';
                } else if (OwnerID === currentId) {
                    cardsHtml += '                                    <li>';
                    cardsHtml += '              <a class="" href="#none" onclick="swal(\'' + item.PropertyName + ' is already yours!\',\'Sorry, you cannot invest on your own deal\')" title="Sorry, you cannot invest on your own deal"><i class="fa fa-money-check-alt"></i> Invest</a>';
                    cardsHtml += '                                    </li>';
                }
                cardsHtml += '                                    <li>';
                cardsHtml += '              <a class="" href="/addphotos/' + item.PropertySPVID + '"><i class="fa fa-camera-retro  "></i> Photos</a>';
                cardsHtml += '                                    </li>';
                cardsHtml += '                                    <li>';
                cardsHtml += '              <a class=" " href="/property-docs/' + item.PropertySPVID + '">Upload Documents</a>';
                cardsHtml += '                                    </li>';
                cardsHtml += '                                </ul>';
                cardsHtml += '                            </div>';
                cardsHtml += '                        </div><!--end row-->';
                cardsHtml += '                    </div><!--end container-->';
                cardsHtml += '                </div><!--end dropdown container-->';
                cardsHtml += '            </div>';


            }
        }
        cardsHtml += '              </div>';
        cardsHtml += '          </div>';
        cardsHtml += '      </div>';
        cardsHtml += '  </div>';
    }

    return cardsHtml;
}


function renderPropertyCardsNew(list, page) {
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    if (page === 'newdeal-prop' || page === 'myproperties') {
        cardsHtml += getNewButton('Add Property', '/addproperty');
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        let OwnerID = item.createdBy.username;
        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6">';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + item._id + '" class="carousel slide" data-ride="carousel">';
        var active = 'active';
        var photos = '';
        var indicators = '';
        var pictures = item.photos;
        if (pictures.length == 0) {
            pictures.push({ "ImageFile": '/img/p10.jpg' });
        }
        for (j = 0; j < pictures.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (pictures.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item._id + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + pictures[j].location + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += indicators;
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += photos;
        cardsHtml += '                </div>';
        if (pictures.length > 1) {
            cardsHtml += '               <a class="carousel-control-prev" href="#carouselIndicators' + item._id + '" data-slide="prev">';
            cardsHtml += '                   <span class="carousel-control-prev-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Previous</span>';
            cardsHtml += '               </a>';
            cardsHtml += '               <a class="carousel-control-next" href="#carouselIndicators' + item._id + '" data-slide="next">';
            cardsHtml += '                   <span class="carousel-control-next-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Next</span>';
            cardsHtml += '               </a>';
        }
        cardsHtml += '            </div>';

        var statusColor = '';
        // if (item.Rejected) {
        //     statusColor = 'card-property-status-rejected';
        // } else
        //     if (item.Listed) {
        //         statusColor = 'card-property-status-listed';
        //     } else {
        //         statusColor = 'card-property-status-pending';
        //     }

        // if (item.isWaitlist) {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">Coming Soon</span>';
        // } else if (page === 'marketplace' && page !== 'deals') {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.EndDate) + ' days left</span>';
        // } else {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + item.Status + '</span>';
        // }

        cardsHtml += '        </div>';
        cardsHtml += '        <div class="card-body">';
        cardsHtml += '            <a class="card-fab box-shadow-shallow" href="/properties/' + item._id + '"><span>i</span></a> ';
        cardsHtml += '            <p class="card-price float-right pt-4">$' + number_format(item.finance.askingPrice, 2) + '</p>';
        cardsHtml += '            <p class="card-title"><a class="" href="/properties/' + item._id + '">' + item.name + '</a></p>';
        cardsHtml += '            <p class="card-text">' + item.location.streetNumber + ' ' + item.location.streetName + '<br>' + item.location.city + ', ' + item.location.country + '</p>';
        cardsHtml += '            <div class="d-flex justify-content-between align-items-center">';
        cardsHtml += '                <div class="card-amenity text-center">';
        cardsHtml += '                      <div class="card-amenity-text">Bed</div>';
        cardsHtml += '                      <div class="card-amenity-icon">';
        cardsHtml += '                          <img class="" src="/img/icon/bed-icon.png" alt="">';
        cardsHtml += '                      </div>';
        cardsHtml += '                      <div class="card-amenity-value">' + item.structure.bedRooms + '</div>';
        cardsHtml += '                  </div>';
        cardsHtml += '                  <div class="card-amenity text-center">';
        cardsHtml += '                     <div class="card-amenity-text">Bath</div>';
        cardsHtml += '                     <div class="card-amenity-icon">';
        cardsHtml += '                         <img class="" src="/img/icon/bath-icon.png" alt="">';
        cardsHtml += '                     </div>';
        cardsHtml += '                     <div class="card-amenity-value">' + item.structure.bathRooms + '</div>';
        cardsHtml += '                 </div>';
        cardsHtml += '                 <div class="card-amenity text-center">';
        cardsHtml += '                     <div class="card-amenity-text">Size</div>';
        cardsHtml += '                     <div class="card-amenity-icon">';
        cardsHtml += '                         <img class="" src="/img/icon/size-icon.png" alt="">';
        cardsHtml += '                     </div>';
        cardsHtml += '                     <div class="card-amenity-value">' + item.structure.squareFeet + ' sqft</div>';
        cardsHtml += '                 </div>';
        cardsHtml += '              </div>';
        cardsHtml += '              </div>';
        cardsHtml += '              <div class="card-footer">';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons pt-4">';
        if (page === 'newdeal-prop') {
            cardsHtml += '              <a class="btn btn-xs btn-success" href="/newdeal-details/Property/' + item._id + '"><i class="fa fa-check  "></i> Select</a>';

        } else {
            cardsHtml += '              <a class="btn btn-sm btn-info" href="/properties/' + item._id + '"><i class="far fa-file"></i> Details</a>';
            if (page === 'marketplace' && OwnerID !== currentId) {
                cardsHtml += '              <a class=" " href="/buyshare/' + item._id + '"><i class="fa fa-money-check-alt"></i> Invest</a>';
            }
            cardsHtml += '            <div class="dropdown dropdown--hover">';
            cardsHtml += '                <span class="dropdown__trigger">Actions<i class="stack-down-open"></i></span>';
            cardsHtml += '                <div class="dropdown__container">';
            cardsHtml += '                    <div class="container">';
            cardsHtml += '                        <div class="row">';
            cardsHtml += '                            <div class="col-md-3 col-lg-2 dropdown__content">';
            cardsHtml += '                                <ul class="menu-vertical">';
            // if (item.Status !== 'Listed') {
            //     cardsHtml += '                                    <li>';
            //     cardsHtml += '              <a class=" " href="/updateproperty/' + item._id + '">Edit Property</a>';
            //     cardsHtml += '                                    </li>';
            // } else if (OwnerID === currentId) {
            //     cardsHtml += '                                    <li>';
            //     cardsHtml += '              <a class="" href="#none" onclick="swal(\'' + item.name + ' is already yours!\',\'Sorry, you cannot invest on your own deal\')" title="Sorry, you cannot invest on your own deal"><i class="fa fa-money-check-alt"></i> Invest</a>';
            //     cardsHtml += '                                    </li>';
            // }
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class="" href="/addphotos/' + item._id + '"><i class="fa fa-camera-retro  "></i> Photos</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/property-docs/' + item._id + '">Upload Documents</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                </ul>';
            cardsHtml += '                            </div>';
            cardsHtml += '                        </div><!--end row-->';
            cardsHtml += '                    </div><!--end container-->';
            cardsHtml += '                </div><!--end dropdown container-->';
            cardsHtml += '            </div>';


        }
        cardsHtml += '              </div>';
        cardsHtml += '          </div>';
        cardsHtml += '      </div>';
        cardsHtml += '  </div>';
    }

    return cardsHtml;
}

/** Returns the HTML for the fund cards
 *
 * @param {type} list
 * @param {type} page [marketplace|profile]
 * @returns {String}
 */
function renderFundCards(list, page) {
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    if (page === 'newdeal-fund' || page === 'myfunds') {
        cardsHtml += getNewButton('Add Fund', '/addfund');
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        let OwnerID = item.Owner.slice(31);
        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6">';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + item.FundID + '" class="carousel slide" data-ride="carousel">';
        var active = 'active';
        var photos = '';
        var indicators = '';
        if (item.Photos.length == 0) {
            item.Photos.push({ "ImageFile": '/img/p10.jpg' });
        }
        for (j = 0; j < item.Photos.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (item.Photos.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item.FundID + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + item.Photos[j].ImageFile + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += indicators;
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += photos;
        cardsHtml += '                </div>';
        if (item.Photos.length > 1) {
            cardsHtml += '               <a class="carousel-control-prev" href="#carouselIndicators' + item.FundID + '" data-slide="prev">';
            cardsHtml += '                   <span class="carousel-control-prev-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Previous</span>';
            cardsHtml += '               </a>';
            cardsHtml += '               <a class="carousel-control-next" href="#carouselIndicators' + item.FundID + '" data-slide="next">';
            cardsHtml += '                   <span class="carousel-control-next-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Next</span>';
            cardsHtml += '               </a>';
        }
        cardsHtml += '            </div>';

        if (item.Rejected) {
            statusColor = 'card-property-status-rejected';
        } else
            if (item.Listed) {
                statusColor = 'card-property-status-listed';
            } else {
                statusColor = 'card-property-status-pending';
            }
        if (item.isWaitlist) {
            cardsHtml += '              <span class="card-property-status ' + statusColor + '">Coming Soon</span>';
        } else if (page === 'marketplace' && page !== 'deals') {
            cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.EndDate) + ' days left</span>';
        } else {
            cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + item.Status + '</span>';
        }
        cardsHtml += '        </div>';
        cardsHtml += '        <div class="card-body">';
        cardsHtml += '            <a class="card-fab box-shadow-shallow" href="/fund/' + item.FundID + '"><span>i</span></a> ';
        //        cardsHtml += '            <p class="card-price float-right pt-4">$' + number_format(item.AskingPrice, 2) + '</p>';
        cardsHtml += '            <p class="card-title"><a class="" href="/fund/' + item.FundID + '">' + item.Name + '</a></p>';
        cardsHtml += '            <p class="card-text">' + item.FundType + '</p>';
        cardsHtml += '            <hr class="card-hr">';
        //        cardsHtml += '            <div class="d-flex justify-content-between align-items-center">';
        //        cardsHtml += '                <div class="card-amenity text-center">';
        //        cardsHtml += '                      <div class="card-amenity-text">Bed</div>';
        //        cardsHtml += '                      <div class="card-amenity-icon">';
        //        cardsHtml += '                          <img class="" src="/img/icon/bed-icon.png" alt="">';
        //        cardsHtml += '                      </div>';
        //        cardsHtml += '                      <div class="card-amenity-value">' + item.Bedrooms + '</div>';
        //        cardsHtml += '                  </div>';
        //        cardsHtml += '                  <div class="card-amenity text-center">';
        //        cardsHtml += '                     <div class="card-amenity-text">Bath</div>';
        //        cardsHtml += '                     <div class="card-amenity-icon">';
        //        cardsHtml += '                         <img class="" src="/img/icon/bath-icon.png" alt="">';
        //        cardsHtml += '                     </div>';
        //        cardsHtml += '                     <div class="card-amenity-value">' + item.Bathrooms + '</div>';
        //        cardsHtml += '                 </div>';
        //        cardsHtml += '                 <div class="card-amenity text-center">';
        //        cardsHtml += '                     <div class="card-amenity-text">Size</div>';
        //        cardsHtml += '                     <div class="card-amenity-icon">';
        //        cardsHtml += '                         <img class="" src="/img/icon/size-icon.png" alt="">';
        //        cardsHtml += '                     </div>';
        //        cardsHtml += '                     <div class="card-amenity-value">' + item.SquareFeet + ' sqft</div>';
        //        cardsHtml += '                 </div>';
        //        cardsHtml += '              </div>';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons pt-4">';
        if (page === 'newdeal-fund') {
            cardsHtml += '              <a class="btn btn-sm btn-success" href="/newdeal-details/Fund/' + item.FundID + '"><i class="fa fa-check  "></i> Select</a>';

        } else {
            if (page !== 'marketplace') {
                cardsHtml += '              <a class="btn btn-xs btn-info" href="/addphotos/fund/' + item.FundID + '"><i class="fa fa-camera-retro  "></i> Photos</a>';
            }
            if (item.Status !== 'Listed') {
                cardsHtml += '               <a class="btn btn-xs btn-info" href="/editfund/' + item.FundID + '"><i class="fa fa-edit  "></i> Edit</a>';
            }
        }
        cardsHtml += '              <a class="btn btn-xs btn-info" href="/fund/' + item.FundID + '"><i class="far fa-file"></i> Details</a>';
        cardsHtml += '              <a class="btn btn-xs btn-info" href="/fund-docs/' + item.FundID + '"><i class="far fa-file"></i> Docs</a>';
        cardsHtml += '              </div>';
        cardsHtml += '          </div>';
        cardsHtml += '      </div>';
        cardsHtml += '  </div>';
    }

    return cardsHtml;
}

function renderFundCardsNew(list, page) {
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    if (page === 'newdeal-fund' || page === 'myfunds') {
        cardsHtml += getNewButton('Add Fund', '/addfund');
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        let OwnerID = item.createdBy.username;
        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6">';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + item._id + '" class="carousel slide" data-ride="carousel">';
        var active = 'active';
        var photos = '';
        var indicators = '';
        let pictures = item.photos;
        if (pictures.length == 0) {
            pictures.push({ "ImageFile": '/img/p10.jpg' });
        }
        for (j = 0; j < pictures.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (pictures.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item._id + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + pictures[j].location + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += indicators;
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += photos;
        cardsHtml += '                </div>';
        if (pictures.length > 1) {
            cardsHtml += '               <a class="carousel-control-prev" href="#carouselIndicators' + item._id + '" data-slide="prev">';
            cardsHtml += '                   <span class="carousel-control-prev-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Previous</span>';
            cardsHtml += '               </a>';
            cardsHtml += '               <a class="carousel-control-next" href="#carouselIndicators' + item._id + '" data-slide="next">';
            cardsHtml += '                   <span class="carousel-control-next-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Next</span>';
            cardsHtml += '               </a>';
        }
        cardsHtml += '            </div>';

        // if (item.Rejected) {
        //     statusColor = 'card-property-status-rejected';
        // } else
        //     if (item.Listed) {
        //         statusColor = 'card-property-status-listed';
        //     } else {
        //         statusColor = 'card-property-status-pending';
        //     }
        // if (item.isWaitlist) {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">Coming Soon</span>';
        // } else if (page === 'marketplace' && page !== 'deals') {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.EndDate) + ' days left</span>';
        // } else {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + item.Status + '</span>';
        // }
        cardsHtml += '        </div>';
        cardsHtml += '        <div class="card-body">';
        cardsHtml += '            <a class="card-fab box-shadow-shallow" href="/fund/' + item._id + '"><span>i</span></a> ';
        //        cardsHtml += '            <p class="card-price float-right pt-4">$' + number_format(item.AskingPrice, 2) + '</p>';
        cardsHtml += '            <p class="card-title"><a class="" href="/fund/' + item._id + '">' + item.name + '</a></p>';
        cardsHtml += '            <p class="card-text">' + item.categoryType.name + '</p>';
        //        cardsHtml += '            <div class="d-flex justify-content-between align-items-center">';
        //        cardsHtml += '                <div class="card-amenity text-center">';
        //        cardsHtml += '                      <div class="card-amenity-text">Bed</div>';
        //        cardsHtml += '                      <div class="card-amenity-icon">';
        //        cardsHtml += '                          <img class="" src="/img/icon/bed-icon.png" alt="">';
        //        cardsHtml += '                      </div>';
        //        cardsHtml += '                      <div class="card-amenity-value">' + item.Bedrooms + '</div>';
        //        cardsHtml += '                  </div>';
        //        cardsHtml += '                  <div class="card-amenity text-center">';
        //        cardsHtml += '                     <div class="card-amenity-text">Bath</div>';
        //        cardsHtml += '                     <div class="card-amenity-icon">';
        //        cardsHtml += '                         <img class="" src="/img/icon/bath-icon.png" alt="">';
        //        cardsHtml += '                     </div>';
        //        cardsHtml += '                     <div class="card-amenity-value">' + item.Bathrooms + '</div>';
        //        cardsHtml += '                 </div>';
        //        cardsHtml += '                 <div class="card-amenity text-center">';
        //        cardsHtml += '                     <div class="card-amenity-text">Size</div>';
        //        cardsHtml += '                     <div class="card-amenity-icon">';
        //        cardsHtml += '                         <img class="" src="/img/icon/size-icon.png" alt="">';
        //        cardsHtml += '                     </div>';
        //        cardsHtml += '                     <div class="card-amenity-value">' + item.SquareFeet + ' sqft</div>';
        //        cardsHtml += '                 </div>';
        //        cardsHtml += '              </div>';
        cardsHtml += '          </div>';
        cardsHtml += '              <div class="card-footer">';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons pt-4">';
        if (page === 'newdeal-fund') {
            cardsHtml += '              <a class="btn btn-sm btn-success" href="/newdeal-details/Fund/' + item._id + '"><i class="fa fa-check  "></i> Select</a>';

        } else {
            if (page !== 'marketplace') {
                cardsHtml += '              <a class="btn btn-xs btn-info" href="/addphotos/fund/' + item._id + '"><i class="fa fa-camera-retro  "></i> Photos</a>';
            }
            if (item.Status !== 'Listed') {
                cardsHtml += '               <a class="btn btn-xs btn-info" href="/editfund/' + item._id + '"><i class="fa fa-edit  "></i> Edit</a>';
            }
        }
        cardsHtml += '              <a class="btn btn-xs btn-info" href="/fund/' + item._id + '"><i class="far fa-file"></i> Details</a>';
        cardsHtml += '              <a class="btn btn-xs btn-info" href="/fund-docs/' + item._id + '"><i class="far fa-file"></i> Docs</a>';
        cardsHtml += '              </div>';
        cardsHtml += '              </div>';
        cardsHtml += '      </div>';
        cardsHtml += '  </div>';
    }

    return cardsHtml;
}

function getDealStatusBadge(item) {
    const html = '';
    if (item.Rejected) {
        statusColor = 'card-property-status-rejected';
    } else
        if (item.Listed) {
            statusColor = 'card-property-status-listed';
        } else {
            statusColor = 'card-property-status-pending';
        }
    if (item.isWaitlist) {
        html += '              <span class="card-property-status ' + statusColor + '">Coming Soon</span>';
    } else if (page === 'marketplace' && page !== 'deals') {
        html += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.EndDate) + ' days left</span>';
    } else {
        html += '              <span class="card-property-status ' + statusColor + '">' + item.Status + '</span>';
    }
    return html;
}
function getWaitlistDealStatusBadge(status) {
    const html = '';
    switch (status) {
        case 'funded':
            html = '              <span class="card-property-status card-property-status-funded">Funded</span>';
    }

    return html;
}


/** Returns the HTML for the properties cards
 *
 * @param {type} list
 * @param {type} page [marketplace|profile]
 * @returns {String}
 */
function renderDealCards(list, page) {
    console.log('renderDealCards')
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    if (page === "mydeals" && list.length == 0) {
        cardsHtml += getNewButton('Add Deal', '/newdeal-type/false');
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        /*====== asset Photos ===================*/


        var active = 'active';
        var photos = '';
        var indicators = '';
        if (item.assetData.photos.length == 0) {
            item.assetData.photos.push({ "location": '/img/p10.jpg' });
        }
        for (j = 0; j < item.assetData.photos.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (item.assetData.photos.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item._id + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + item.assetData.photos[j].location + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        /*====== asset Photos ===================*/




        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6">';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow deal-card">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + item._id + '" class="carousel slide" data-ride="carousel">';
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += indicators;
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += photos;
        cardsHtml += '                </div>';
        if (item.assetData.photos.length > 1) {
            cardsHtml += '               <a class="carousel-control-prev" href="#carouselIndicators' + item._id + '" data-slide="prev">';
            cardsHtml += '                   <span class="carousel-control-prev-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Previous</span>';
            cardsHtml += '               </a>';
            cardsHtml += '               <a class="carousel-control-next" href="#carouselIndicators' + item._id + '" data-slide="next">';
            cardsHtml += '                   <span class="carousel-control-next-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Next</span>';
            cardsHtml += '               </a>';
        }
        cardsHtml += '            </div>';

        var statusColor = '';
        // if (item.Rejected) {
        //     statusColor = 'card-property-status-rejected';
        // } else
        //     if (item.Listed) {
        //         statusColor = 'card-property-status-listed';
        //     } else {
        //         statusColor = 'card-property-status-pending';
        //     }
        // if (item.isWaitlist) {
        //     cardsHtml += '              <span class="card-property-status card-property-status-listed">Coming Soon</span>';
        // } else if (page === 'marketplace' && page !== 'deals') {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.endDate) + ' days left</span>';
        // } else {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + item.status + '</span>';
        // }
        cardsHtml += '        </div><!-- end .card-img-top -->';
        cardsHtml += '        <div class="card-body">';
        item.assetType = item.assetData.categoryType.assetType;
        if (item.assetType === 'Fund') {
            cardsHtml += getFundDealCardBody(item);
        } else {
            cardsHtml += getPropertyDealCardBody(item);
        }
        cardsHtml += '          </div><!-- end  .card-body -->';
        cardsHtml += '          <div class="card-footer">';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons">';
        detailsLink = '/deal/';

        cardsHtml += '              <a class="btn btn-reitium-bg" href="' + detailsLink + item._id + '">Details</a>';
        if (page === 'mydeals') {
            cardsHtml += '            <div class="dropdown dropdown--hover">';
            cardsHtml += '                <span class="dropdown__trigger">Actions<i class="stack-down-open"></i></span>';
            cardsHtml += '                <div class="dropdown__container">';
            cardsHtml += '                    <div class="container">';
            cardsHtml += '                        <div class="row">';
            cardsHtml += '                            <div class="col-md-3 col-lg-2 dropdown__content">';
            cardsHtml += '                                <ul class="menu-vertical">';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/deal/edit/' + item._id + '">Edit Deal</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/newdeal-docs/' + item._id + '">Upload Documents</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/newdeal-legal/' + item._id + '">Legal Information</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/newdeal-juristiction/' + item._id + '">Juristiction</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                </ul>';
            cardsHtml += '                            </div>';
            cardsHtml += '                        </div><!--end row-->';
            cardsHtml += '                    </div><!--end container-->';
            cardsHtml += '                </div><!--end dropdown container-->';
            cardsHtml += '            </div>';
        }
        cardsHtml += '              </div> <!-- end of d-flex justify-co... -->';
        cardsHtml += '          </div><!-- end  .card-footer -->';
        cardsHtml += '      </div><!-- end .card -->';
        cardsHtml += '  </div><!-- end .col-md-4 -->';
    }
    return cardsHtml;
}
function renderDealCardsNew(list, page) {
    console.log('renderWaitlistDealCards')
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    if (page === "mydeals" && list.length == 0) {
        cardsHtml += getNewButton('Add Deal', '/newdeal-type/true');
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        // let OwnerID = item.Owner.slice(31);
        console.log(list[i]);
        // let funded = item.CurrentlyFunded;
        // let total = item.AmountRaising;
        // let percentage = funded / total * 100;

        // let asset = item.PropertyData;
        /*====== asset Photos ===================*/


        var active = 'active';
        var photos = '';
        var indicators = '';
        if (item.photos.length == 0) {
            item.photos.push({ "ImageFile": '/img/p10.jpg' });
        }
        for (j = 0; j < item.photos.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (item.photos.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item._id + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + item.photos[j] + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        /*====== asset Photos ===================*/




        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6">';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow deal-card">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + item._id + '" class="carousel slide" data-ride="carousel">';
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += indicators;
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += photos;
        cardsHtml += '                </div>';
        if (item.photos.length > 1) {
            cardsHtml += '               <a class="carousel-control-prev" href="#carouselIndicators' + item._id + '" data-slide="prev">';
            cardsHtml += '                   <span class="carousel-control-prev-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Previous</span>';
            cardsHtml += '               </a>';
            cardsHtml += '               <a class="carousel-control-next" href="#carouselIndicators' + item._id + '" data-slide="next">';
            cardsHtml += '                   <span class="carousel-control-next-icon"></span>';
            cardsHtml += '                   <span class="sr-only">Next</span>';
            cardsHtml += '               </a>';
        }
        cardsHtml += '            </div>';

        var statusColor = '';
        if (item.Rejected) {
            statusColor = 'card-property-status-rejected';
        } else
            if (item.Listed) {
                statusColor = 'card-property-status-listed';
            } else {
                statusColor = 'card-property-status-pending';
            }
        // if (item.isWaitlist) {
        cardsHtml += '              <span class="card-property-status card-property-status-listed">Coming Soon</span>';
        // } else if (page === 'marketplace' && page !== 'deals') {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + getDaysLeft(item.endDate) + ' days left</span>';
        // } else {
        //     cardsHtml += '              <span class="card-property-status ' + statusColor + '">' + item.status + '</span>';
        // }
        cardsHtml += '        </div><!-- end .card-img-top -->';
        cardsHtml += '        <div class="card-body">';
        if (item.waitListType !== 'Property') {
            cardsHtml += getFundDealCardBodyNew(item);
        } else {
            cardsHtml += getPropertyDealCardBodyNew(item);
        }
        cardsHtml += '          </div><!-- end  .card-body -->';
        cardsHtml += '          <div class="card-footer">';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons">';
        if(item.isFullDeal){
            detailsLink = '/deal/';
        }else{

            detailsLink = '/deal-waitlist/';
        }

        cardsHtml += '              <a class="btn btn-reitium-bg" href="' + detailsLink + item._id + '">Details</a>';
        if (page === 'mydeals') {
            cardsHtml += '            <div class="dropdown dropdown--hover">';
            cardsHtml += '                <span class="dropdown__trigger">Actions<i class="stack-down-open"></i></span>';
            cardsHtml += '                <div class="dropdown__container">';
            cardsHtml += '                    <div class="container">';
            cardsHtml += '                        <div class="row">';
            cardsHtml += '                            <div class="col-md-3 col-lg-2 dropdown__content">';
            cardsHtml += '                                <ul class="menu-vertical">';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/deal/edit/' + item._id + '">Edit Deal</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/newdeal-docs/' + item._id + '">Upload Documents</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/newdeal-legal/' + item._id + '">Legal Information</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                    <li>';
            cardsHtml += '              <a class=" " href="/newdeal-juristiction/' + item._id + '">Juristiction</a>';
            cardsHtml += '                                    </li>';
            cardsHtml += '                                </ul>';
            cardsHtml += '                            </div>';
            cardsHtml += '                        </div><!--end row-->';
            cardsHtml += '                    </div><!--end container-->';
            cardsHtml += '                </div><!--end dropdown container-->';
            cardsHtml += '            </div>';
        }
        cardsHtml += '              </div> <!-- end of d-flex justify-co... -->';
        cardsHtml += '          </div><!-- end  .card-footer -->';
        cardsHtml += '      </div><!-- end .card -->';
        cardsHtml += '  </div><!-- end .col-md-4 -->';
    }
    return cardsHtml;
}

function getFundDealCardBody(item) {
    let asset = item.assetData;
    let funded = item.totalRaising;
    // let funded = 0;
    let total = item.targetAmount;
    let percentage = funded / total * 100;
    detailsLink = '/deal/';
    var cardsHtml = '';
    cardsHtml += `            <div class="badge badge-deal-card" >${item.assetData.categoryType.assetType}</div>`;
    // cardsHtml += '            <a class="card-fab box-shadow-shallow" href="' + detailsLink + item._id + '"><span>i</span></a>';
    cardsHtml += '                <div class="card-title mb-0"><a class="" href="' + detailsLink + item._id + '">' + item.name + '</a></div>';
    if(asset.location)
        cardsHtml += `                  <div class="card-text-location  text-truncate">${asset.location.city || ''}, ${asset.location.province || ''}, ${getCountryName(asset.location.country)}</div>`;
    // cardsHtml += '                <div class="card-price   ">CAD $' + number_format(total, 0) + '</div>';
    // cardsHtml += '            <hr class="card-hr">';
    cardsHtml += '            <div class="d-flex justify-content-between mt-3">';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">$${number_format(item.targetAmount, 0)}</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Target</div>';
    cardsHtml += '                  </div>';
    cardsHtml += '                  <div class="card-amenity-separator"></div>';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">$${number_format(funded, 0)}</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Raised</div>';
    cardsHtml += '                  </div>';
    cardsHtml += '                  <div class="card-amenity-separator"></div>';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">${number_format(item.roiRental, 0)}%</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Return<sup>*</sup></div>';
    cardsHtml += '                  </div>';
    cardsHtml += '              </div>';
    cardsHtml += '            <div class="property-progress py-2">';
    cardsHtml += '                <div class="progress">';
    cardsHtml += `                   <div class="progress-bar" style="width:${percentage}%"></div>`;
    cardsHtml += '                </div>';
    cardsHtml += '            </div>';

    cardsHtml += '            <div class="d-flex justify-content-between ">';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class=""><i class="fa fa-users"></i> ${item.totalInvesters} Investors</div>`;
    cardsHtml += '                  </div>';
    cardsHtml += '                  <div class="card-amenity-separator"></div>';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class=""><i class="fa fa-calendar"></i> ${getDaysLeft(item.endDate)} Days Left</div>`;
    cardsHtml += '                  </div>';
    cardsHtml += '              </div>';

    return cardsHtml;
}
function getPropertyDealCardBody(item) {
    let asset = item.assetData;
    console.log('item: ', item);

    let funded = item.totalRaising;
    // let funded = 0;
    let total = item.targetAmount;
    let percentage = funded / total * 100;
    detailsLink = '/deal/';
    var cardsHtml = '';
    cardsHtml += `            <div class="badge badge-deal-card" >${item.assetData.categoryType.assetType}</div>`;
    // cardsHtml += '            <a class="card-fab box-shadow-shallow" href="' + detailsLink + item._id + '"><span>i</span></a>';
    cardsHtml += '                <div class="card-title mb-0"><a class="" href="' + detailsLink + item._id + '">' + item.name + '</a></div>';
    if(asset.location)
        cardsHtml += `                <div class="card-text-location text-truncate">${asset.location.city || ''}, ${asset.location.province || ''}, ${getCountryName(asset.location.country)}</div>`;
    // cardsHtml += '                <div class="card-price   ">CAD $' + number_format(total, 0) + '</div>';
    // cardsHtml += '            <hr class="card-hr">';
    cardsHtml += '            <div class="d-flex justify-content-between mt-3">';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">$${number_format(item.targetAmount, 0)}</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Target</div>';
    cardsHtml += '                  </div>';
    cardsHtml += '                  <div class="card-amenity-separator"></div>';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">$${number_format(funded, 0)}</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Raised</div>';
    cardsHtml += '                  </div>';
    cardsHtml += '                  <div class="card-amenity-separator"></div>';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">${number_format(item.roiRental, 0)}%</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Return<sup>*</sup></div>';
    cardsHtml += '                  </div>';
    cardsHtml += '              </div>';
    cardsHtml += '            <div class="property-progress py-2">';
    cardsHtml += '                <div class="progress">';
    cardsHtml += `                   <div class="progress-bar" style="width:${percentage}%"></div>`;
    cardsHtml += '                </div>';
    cardsHtml += '            </div>';
    
    cardsHtml += '            <div class="d-flex justify-content-between ">';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class=""><i class="fa fa-users"></i> ${item.totalInvesters} Investors</div>`;
    cardsHtml += '                  </div>';
    cardsHtml += '                  <div class="card-amenity-separator"></div>';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class=""><i class="fa fa-calendar"></i> ${getDaysLeft(item.endDate)} Days Left</div>`;
    cardsHtml += '                  </div>';
    cardsHtml += '              </div>';
    // ===========

    // cardsHtml += '            <div class="d-flex justify-content-between align-items-center">';
    // // cardsHtml += '                    <div class="card-amenity text-center">';
    // // cardsHtml += '                        <div class="card-amenity-text">' + getCountryName(item.issuingCountry) + '</div>';
    // // cardsHtml += '                        <div class="card-amenity-icon">';
    // // cardsHtml += '                            <img class="" style="width: 75px" src="/img/flags-icons/' + item.issuingCountry + '.png" alt="">';
    // // cardsHtml += '                        </div>';
    // // cardsHtml += '                    </div>';
    // cardsHtml += '                <div class="card-amenity text-center">';
    // cardsHtml += '                      <div class="card-amenity-text">Bed</div>';
    // cardsHtml += '                      <div class="card-amenity-icon">';
    // cardsHtml += '                          <img class="" src="/img/icon/bed-icon.png" alt="">';
    // cardsHtml += '                      </div>';
    // cardsHtml += '                      <div class="card-amenity-value">' + asset.structure.bedRooms + '</div>';
    // cardsHtml += '                  </div>';
    // cardsHtml += '                  <div class="card-amenity text-center">';
    // cardsHtml += '                     <div class="card-amenity-text">Bath</div>';
    // cardsHtml += '                     <div class="card-amenity-icon">';
    // cardsHtml += '                         <img class="" src="/img/icon/bath-icon.png" alt="">';
    // cardsHtml += '                     </div>';
    // cardsHtml += '                     <div class="card-amenity-value">' + asset.structure.bathRooms + '</div>';
    // cardsHtml += '                 </div>';
    // cardsHtml += '                 <div class="card-amenity text-center">';
    // cardsHtml += '                     <div class="card-amenity-text">Size</div>';
    // cardsHtml += '                     <div class="card-amenity-icon">';
    // cardsHtml += '                         <img class="" src="/img/icon/size-icon.png" alt="">';
    // cardsHtml += '                     </div>';
    // cardsHtml += '                     <div class="card-amenity-value">' + asset.structure.squareFeet + '<sup>sqft</sup></div>';
    // cardsHtml += '                 </div>';
    // if (!item.isWaitlist) {
    //     cardsHtml += '                 <div class="card-amenity text-center">';
    //     cardsHtml += '                     <div class="card-amenity-text">ROI Rental</div>';
    //     cardsHtml += '                     <div class="card-amenity-icon">';
    //     cardsHtml += '                          <img class="" src="/img/icon/roi-icon.png" alt="">';
    //     cardsHtml += '                      </div>';
    //     cardsHtml += '                      <div class="card-amenity-value">' + item.roiRental + '<small>%</small></div>';
    //     cardsHtml += '                  </div>';
    //     cardsHtml += '                  <div class="card-percent text-center" >';
    //     cardsHtml += '                     <div class="card-amenity-text">Founded %</div>';
    //     //        myProperties += '                       <div class="card-percent-value" id="">' + percentage.toFixed(0) + '%</div>';
    //     cardsHtml += '                     <div class="card-amenity-icon">';
    //     cardsHtml += '                       <svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" width="50" height="50" xmlns="http://www.w3.org/2000/svg">';
    //     cardsHtml += '                         <circle class="circle-chart__background" stroke="#efefef" stroke-width="2" fill="none" cx="16.91549431" cy="16.91549431" r="15.91549431" />';
    //     cardsHtml += '                         <circle class="circle-chart__circle" stroke="#2ecc71" stroke-width="2" stroke-dasharray="' + percentage.toFixed(0) + ',100" stroke-linecap="round" fill="none" cx="16.91549431" cy="16.91549431" r="15.91549431" />';
    //     cardsHtml += '                         <g class="circle-chart__info">';
    //     cardsHtml += '                               <text class="circle-chart__percent" x="16.91549431" y="17" alignment-baseline="central" text-anchor="middle" font-size="11">' + percentage.toFixed(0) + '</text>';
    //     //        myProperties += '                             <text class="circle-chart__subline" x="16.91549431" y="20.5" alignment-baseline="central" text-anchor="middle" font-size="2">Yay 30% progress!</text>';
    //     cardsHtml += '                         </g>';
    //     cardsHtml += '                       </svg>';
    //     cardsHtml += '                      </div>';
    //     cardsHtml += '                  </div>';
    // }
    // cardsHtml += '              </div>';

    return cardsHtml;
}



function getFundDealCardBodyNew(item) {
    console.log('item: ',item);
    
    detailsLink = '/deal-waitlist/';
    var cardsHtml = '';
    cardsHtml += `            <div class="badge badge-deal-card" >${item.waitListType}</div>`;
    // cardsHtml += '            <a class="card-fab box-shadow-shallow" href="' + detailsLink + item._id + '"><span>i</span></a>';
    cardsHtml += '                <div class="card-title mb-0"><a class="" href="' + detailsLink + item._id + '">' + item.name + '</a></div>';
    cardsHtml += '                  <div class="card-text-location mb-3 text-truncate">' + item.waitListLocation.city + ', ' + item.waitListLocation.province + ', ' + getCountryName(item.waitListLocation.country) + '</div>';
    // cardsHtml += '                <div class="card-price   ">CAD $' + number_format(total, 0) + '</div>';
    // cardsHtml += '            <hr class="card-hr">';
    cardsHtml += '            <div class="d-flex  ">';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">$${number_format(item.price, 0)}</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Target</div>';
    cardsHtml += '                  </div>';
    cardsHtml += '              </div>';


    return cardsHtml;
}
function getPropertyDealCardBodyNew(item) {
    detailsLink = '/deal-waitlist/';
    var cardsHtml = '';
    cardsHtml += `            <div class="badge badge-deal-card" >${item.waitListType}</div>`;
    // cardsHtml += '            <a class="card-fab box-shadow-shallow" href="' + detailsLink + item._id + '"><span>i</span></a>';
    cardsHtml += '                <div class="card-title mb-0"><a class="" href="' + detailsLink + item._id + '">' + item.name + '</a></div>';
    cardsHtml += '                  <div class="card-text-location mb-3 text-truncate">' + item.waitListLocation.city + ', ' + item.waitListLocation.province + ', ' + getCountryName(item.waitListLocation.country) + '</div>';
    // cardsHtml += '                <div class="card-price   ">CAD $' + number_format(total, 0) + '</div>';
    // cardsHtml += '            <hr class="card-hr">';
    cardsHtml += '            <div class="d-flex  ">';
    cardsHtml += '                  <div class="card-amenity">';
    cardsHtml += `                      <div class="card-amenity-value-lg">$${number_format(item.price, 0)}</div>`;
    cardsHtml += '                      <div class="card-amenity-text">Target</div>';
    cardsHtml += '                  </div>';
    cardsHtml += '              </div>';

    return cardsHtml;
}
function getNewButton(text, link) {
    return ' <div class="col-md-4 col-sm-6 col-sm-6">    <div class="card deal-card mb-5 mx-2  text-center" style="border: 2px dotted #ccc">   <div style="margin: 60% auto;min-width:100px"><p class="card-title">' + text + '</p><br><a class="rounded-circle box-shadow" href="' + link + '" style=" padding: 30px 35px; "><i class="fa fa-plus"></i></a>    </div> </div>  </div>';

}

/** Returns the HTML for the properties cards
 *
 * @param {type} list
 * @param {type} page [marketplace|profile]
 * @returns {String}
 */
function renderNothingFoundCard(msg) {
    if (typeof msg === 'undefined')
        msg = '<strong>No results found</strong><br>Try adjusting your search to find what you are looking for';
    var html = `<div class="col-md-4 col-sm-6 col-sm-6">    <div class="card deal-card mb-5 mx-2 p-5 text-center" style=" border: 2px dotted #ccc">   <div style="margin: 60% auto;"><img src="/img/icon/no-results.png"><p class=" type--fade">${msg}</p>    </div> </div>  </div>`;
    return html;
}

/** Returns the HTML for the properties cards
 *
 * @param {type} list
 * @param {type} page [marketplace|profile]
 * @returns {String}
 */
function renderPortifolioCards(list, page) {
    if (page === undefined) {
        page = 'marketplace';
    }
    var cardsHtml = '';
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        //        console.log(list[i]);
        //        myProperties += '<div class="item">' + 'Property ID: ' + item.Property + '<br>' + 'Quantity: ' + item.Quantity + '<br>'
        //                + 'Project Funded: ' + item.Authorized + '</div>';

        let DealID = item._id.split("#")[1];
        let ShareID = item.ShareID;
        cardsHtml += '<div class="col-md-4 col-sm-6 col-sm-6 " >';
        cardsHtml += '    <div class="card deal-card mb-5 mx-2 box-shadow" id="card-' + DealID + '-' + ShareID + '">';
        cardsHtml += '        <div class="card-img-top"  >';
        cardsHtml += '            <div id="carouselIndicators' + DealID + '" class="carousel slide" data-ride="carousel">';
        cardsHtml += '                <ol class="carousel-indicators">';
        cardsHtml += '                </ol>';
        cardsHtml += '                <div class="carousel-inner">';
        cardsHtml += '                </div>';
        cardsHtml += '            </div>';
        cardsHtml += '        </div>';
        cardsHtml += '        <div class="card-body">';
        cardsHtml += '            <p class="card-price  pt-2">Invested: $' + number_format(item.Quantity, 2) + '</p>';
        //        myProperties += '            <p class="card-text pt-2">Authorized: ' + (item.Authorized) + '</p>';
        cardsHtml += '            <hr class="card-hr">';
        cardsHtml += '            <a class="card-fab box-shadow-shallow" href="/deal/' + DealID + '"><span>i</span></a> ';
        cardsHtml += '            <p class="card-price float-right pt-4" >$<span class="filling" id="AskingPrice"></span></p>';
        cardsHtml += '            <p class="card-title"><a class="" href="/deal/' + DealID + '"><span class="filling" id="Name"> 0000000</span> </a></p>';
        cardsHtml += '            <p class="card-text"><span class="filling" id="StreetNumber">00 </span><span class="filling" id="StreetName"> 0000000000</span>\n\
                                            <br><span class="filling" id="City">0000000000 </span><span class="filling" id="Country">,000000000</span></p>';
        cardsHtml += '            <p class="">Paid: ' + item.Paid + '</p>';
        cardsHtml += '            <hr class="card-hr">';
        cardsHtml += '            <div class="property-progress pb-2">';
        cardsHtml += '                <div class="progress">';
        cardsHtml += '                    <div class="progress-bar" style="width:1%"></div>';
        cardsHtml += '                </div>';
        cardsHtml += '                <div class="d-flex justify-content-between " style="font-size: 12px;">';
        cardsHtml += '                    <div class="property-funded text-success"><span id="CurrentlyFundedPercent" class="">88</span>% Funded</div>';
        cardsHtml += '                    <div class="property-funded-values">$<span id="CurrentlyFunded" class="">580,000</span> of $<span id="AskingPrice2" class="">750,000</span></div>';
        cardsHtml += '                </div>';
        cardsHtml += '            </div>';
        //        myProperties += '            <table class="table">';
        //        myProperties += '                <tr>';
        //        myProperties += '                    <td>';
        //        myProperties += '                        <div class="photo-box-item-value"><span class="" id="ROI">12</span>%</div>';
        //        myProperties += '                        <div class="photo-box-item-text">ROI</div>';
        //        myProperties += '                    </td>';
        //        myProperties += '                    <td>';
        //        myProperties += '                        <div class="photo-box-item-value"><span class="" id="Dividend">8</span>%</div>';
        //        myProperties += '                        <div class="photo-box-item-text">Dividend</div>';
        //        myProperties += '                    </td>';
        //        myProperties += '                    <td>';
        //        myProperties += '                        <div class="photo-box-item-value"><span class="" id="Appreciation">5</span>%</div>';
        //        myProperties += '                        <div class="photo-box-item-text">Appreciation</div>';
        //        myProperties += '                    </td>';
        //        myProperties += '                </tr>';
        //        myProperties += '                <tr>';
        //        myProperties += '                    <td>';
        //        myProperties += '                        <div class="photo-box-item-value"><span id="Investors" class="">127</span></div>';
        //        myProperties += '                        <div class="photo-box-item-text">investors</div>';
        //        myProperties += '                    </td>';
        //        myProperties += '                    <td>';
        //        myProperties += '                        <div class="photo-box-item-value"><span id="DaysLeft" class="">21</span></div>';
        //        myProperties += '                        <div class="photo-box-item-text">days left</div>';
        //        myProperties += '                    </td>';
        //        myProperties += '                    <td>';
        ////        myProperties += '                        <div class="photo-box-item-value "><span id="CurrentlyFundedPercent2" class="">100</span>%</div>';
        ////        myProperties += '                        <div class="photo-box-item-text">funded</div>';
        //        myProperties += '                    </td>';
        //        myProperties += '                </tr>';
        //        myProperties += '            </table>';
        cardsHtml += '              <div class="d-flex justify-content-between card-buttons  ">';
        cardsHtml += '                   <a class="btn btn-xs btn-info" href="/deal/' + DealID + '"><i class="far fa-file"></i> Details</a>';
        cardsHtml += '              </div>';
        cardsHtml += '          </div>';
        cardsHtml += '      </div>';
        cardsHtml += '  </div>';

        fillPropertyCardInfo(ShareID, DealID);
    }
    return cardsHtml;
}

function fillPropertyCardInfo(ShareID, DealID) {

    var url = "/api/deal/" + DealID;
    $.get(url).done(function (response) {
        let item = response['data'];
        //        console.log(item);
        let asset = item.PropertyData;
        let card = $('#card-' + DealID + '-' + ShareID);

        var active = 'active';
        var photos = '';
        var indicators = '';
        for (j = 0; j < asset.Photos.length; j++) {
            if (j > 0) {
                active = '';
            }
            if (asset.Photos.length > 1) {
                indicators += '                    <li data-target="#carouselIndicators' + item.PropertySPVID + '" data-slide-to="' + j + '" class="' + active + '"></li>';
            }

            photos += '                    <div class="carousel-item ' + active + '">';
            photos += '                        <div class="d-block w-100 card-img-top" style="background: url(\'' + asset.Photos[j].ImageFile + '\') no-repeat center center;background-size:cover"></div>';
            photos += '                    </div>';
        }
        card.find(".carousel-inner").html(photos);
        card.find(".carousel-indicators").html(indicators);


        card.find('#Name').html(item.Name);
        card.find('#StreetName').html(asset.StreetName);
        card.find('#StreetNumber').html(asset.StreetNumber);
        card.find('#City').html(asset.City);
        card.find('#Country').html(getCountryName(asset.Country));
        card.find('#AskingPrice').html(number_format(item.AmountRaising, 2));



        let CurrentlyFundedPercent = item.CurrentlyFunded * 100 / item.AmountRaising;

        card.find('.progress-bar').css('width', CurrentlyFundedPercent + '%');
        card.find('#CurrentlyFundedPercent').html(number_format(CurrentlyFundedPercent, 2));
        card.find('#CurrentlyFunded').html(number_format(item.CurrentlyFunded, 2));
        card.find('#AskingPrice2').html(number_format(item.AmountRaising, 2));
        card.find('.filling').removeClass('filling');

        //        console.log(response);
    });


}

function renderApprovalStatus(item) {
    var appraiser = '';
    var lawyer = '';
    var accauntant = '';
    var admin = '';
    //    item.LawyerApproved = true
    if (item.AppraiserApproved === true) {
        appraiser = 'completed';
    } else {
        appraiser = 'active';
    }
    if (item.LawyerApproved === true) {
        lawyer = 'completed';
    }
    if (item.AccountantApproved === true) {
        accauntant = 'completed';
    }
    if (item.AdminApproved === true) {
        admin = 'completed';
    }
    //    if (item.AppraiserApproved === true) {
    //        appraiser = 'completed';
    //        if (item.LawyerApproved === true) {
    //            lawyer = 'completed';
    //            if (item.AccountantApproved === true) {
    //                accauntant = 'completed';
    //                if (item.AdminApproved === true) {
    //                    admin = 'completed';
    //                } else {
    //                    admin = 'active';
    //                }
    //            } else {
    //                accauntant = 'active';
    //            }
    //        } else {
    //            lawyer = 'active';
    //        }
    //    } else {
    //        appraiser = 'active';
    //    }

    var html = '';
    html += '        <div class="breadcrumb ">';
    html += '        <ul class=" steps-small steps">';
    html += '		<li class="' + appraiser + '"><a href="' + (appraiser !== 'completed' ? '/deal/approval/appraiser/' + item._id : '#none') + '">Appraiser</a></li>';
    html += '		<li class="' + lawyer + '"><a href="' + (lawyer !== 'completed' ? '/deal/approval/lawyer/' + item._id : '#none') + '">Lawyer</a></li>';
    html += '		<li class="' + accauntant + '"><a href="' + (accauntant !== 'completed' ? '/deal/approval/accountant/' + item._id : '#none') + '">Accountant</a></li>';
    html += '		<li class="' + admin + '"><a href="' + (admin !== 'completed' ? '/admin/deal/approval/' + item._id : '#none') + '">Admin</a></li>';
    html += '       </ul>';
    html += '       </div>';
    return html;
}

function renderApprovalStatusFullDeal(item) {
    let appraiser, lawyer, accauntant, admin = '';
    appraiser = (item.approvalProcess.appriser.isApproved) ? 'completed' : 'active';
    if (item.approvalProcess.lawyer.isApproved) {
        lawyer = 'completed';
    }
    if (item.approvalProcess.accountant.isApproved) {
        accauntant = 'completed';
    }
    if (item.approvalProcess.admin.isApproved) {
        admin = 'completed';
    }
    let html = '';
    html += '        <div class="breadcrumb ">';
    html += '        <ul class=" steps-small steps">';
    // The below commented things will be implemented later so dont erase.
    // html += '		<li class="' + appraiser + '"><a href="' + (appraiser !== 'completed' ? '/deal/approval/appraiser/' + item._id : '#none') + '">Appraiser</a></li>';
    // html += '		<li class="' + lawyer + '"><a href="' + (lawyer !== 'completed' ? '/deal/approval/lawyer/' + item._id : '#none') + '">Lawyer</a></li>';
    // html += '		<li class="' + accauntant + '"><a href="' + (accauntant !== 'completed' ? '/deal/approval/accountant/' + item._id : '#none') + '">Accountant</a></li>';
    // html += '		<li class="' + admin + '"><a href="' + (admin !== 'completed' ? '/admin/deal/approval/' + item._id : '#none') + '">Admin</a></li>';

    html += '		<li class="' + appraiser + '"><a href="#none">Appraiser</a></li>';
    html += '		<li class="' + lawyer + '"><a href="#none">Lawyer</a></li>';
    html += '		<li class="' + accauntant + '"><a href="#none">Accountant</a></li>';
    html += '		<li class="' + admin + '"><a href="' + (admin !== 'completed' ? '/admin/deal/approval/' + item._id : '#none') + '">Admin</a></li>';

    html += '       </ul>';
    html += '       </div>';
    return html;
}

function renderRaisingProgress(item, small) {
    //     item.CurrentlyFunded=132000000 ;
    //     item.AmountRaising = 150000000;
    var percent = item.CurrentlyFunded * 100 / item.AmountRaising;
    var html = '';
    html += '<div class="progress-small">';
    html += '   <div class="progress " >';
    html += '       <div class="progress-bar" style="width:' + number_format(percent, 2) + '%"></div>';
    html += '   </div>';
    html += '   <div class="d-flex justify-content-between ">';
    html += '       <div class="property-funded text-success"><span  class=" ">' + number_format(percent, 2) + '</span>%</div>';
    html += '       <div class="property-funded-values">$<span class=" ">' + number_format(item.CurrentlyFunded, 2) + '</span> of $<span class=" ">' + number_format(item.AmountRaising, 2) + '</span></div>';
    html += '   </div>';
    html += '</div>';
    return html;
}


function toggleFavoriteStar(favorited) {
    console.log('favorited: ', favorited);
    console.log($('.btn-favourite-click'));
    $('.btn-favourite-click').each(function () {
        const btn = $(this);
        const text = btn.find('.btn__text');

        if (!favorited) {
            text.find('.fa-star').addClass('far').removeClass('fas')
            text.find('.fa-paper-plane').addClass('far').removeClass('fas')
            text.find('.btn-favourite-text').html('Follow')
        } else if (favorited) {
            text.find('.fa-star').addClass('fas').removeClass('far')
            text.find('.fa-paper-plane').addClass('fas').removeClass('far')
            text.find('.btn-favourite-text').html('Unfollow')
            console.log('btn.find(\'.btn-favourite-text\'): ', btn.find('.btn-favourite-text'));
        }
    })


    // <a  class="btn btn-favourite ml-2"><i class="far fa-star"></i> Add to my Waitlist</a>
}

function addFavoriteDealBtnListener(dealId) {

    var favDisabled = false;
    $('.btn-favourite-click').each(function () {
        $(this).on('click', () => {
            const isFullDeal = Boolean($(this).data('is-full-deal'));

            if (favDisabled === false) {
                favDisabled = true;

                $.post('/api/user/mobile/deal/favorite/', {dealId,isFullDeal}, (data) => {
                    console.log('data: ', data);
                    const { message } = data.data;
                    if (message === "Deal has been removed from favorites") {
                        console.log('remove favorited: ');
                        toggleFavoriteStar(false)
                    } else {
                        $("#favoriteModal").modal();
                        console.log('favorited: ');
                        console.log($("#favoriteModal"));
                        toggleFavoriteStar(true)
                    }
                }, 'json')
                    .always(function () {
                        console.log('favDisabled');
                        favDisabled = false;
                    });
            }
        })
    })
}