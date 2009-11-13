// Based on jquery.rest_in_place.js, but using a TEXTAREA & submit/cancel buttons.

jQuery.fn.rest_in_place_multiline = function(url, objectName, attributeName) {
  var e = this;
  function clickFunction() {
    var oldValue = e.html();
    e.html('<form action="javascript:void(0)" style="display:inline;"><br/><textarea>' + oldValue + '</textarea><br/><input type="submit" class="submit_button" value="Save"/><input type="button" class="cancel_button" value="Cancel"/></form>');
    e.find("textarea")[0].focus();
    e.find("textarea")[0].select();
    e.unbind('click');
    e.find(".cancel_button").click(function(){
      e.html(oldValue);
      e.click(clickFunction);
      return false;
    })
    e.find("form").submit(function(){
      var value = e.find("textarea").val();
      e.html("saving...");
      jQuery.ajax({
        "url" : url,
        "type" : "post",
        "data" : "_method=put&"+objectName+'['+attributeName+']='+encodeURIComponent(value)+(window.rails_authenticity_token ? "&authenticity_token="+encodeURIComponent(window.rails_authenticity_token) : ''),
        "success" : function(){
          jQuery.ajax({
            "url" : url,
            "beforeSend"  : function(xhr){ xhr.setRequestHeader("Accept", "application/javascript"); },
            "success" : function(json){
              e.html(eval('(' + json + ')' )[objectName][attributeName]);
              e.click(clickFunction);
            }
          });
        }
      });
      return false;
    })
  }
  this.click(clickFunction);
}

jQuery(function(){
  jQuery(".rest_in_place_multiline").each(function(){
    var e = jQuery(this);
    var url; var obj; var attrib;
    e.parents().each(function(){
      url    = url    || jQuery(this).attr("url");
      obj    = obj    || jQuery(this).attr("object");
      attrib = attrib || jQuery(this).attr("attribute");
    });
    e.parents().each(function(){
      if (res = this.id.match(/^(\w+)_(\d+)$/i)) {
        obj = obj || res[1];
      }
    });
    url    = e.attr("url")       || url    || document.location.pathname;
    obj    = e.attr("object")    || obj;
    attrib = e.attr("attribute") || attrib;
    e.rest_in_place_multiline(url, obj, attrib);
  });
});