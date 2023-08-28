this.SS_SearchUI = (function () {
  function SS_SearchUI() {
  }

  var selectTable;
  var selectTo = 0,selectCc = 0,selectBcc = 0;

  SS_SearchUI.anchorAjaxBox;
  console.log("-----------------SS_SearchUI.anchorAjaxBox");
  console.dir(self.anchorAjaxBox, { depth: null });

  SS_SearchUI.defaultTemplate = " \
    <tr data-id=\"<%= data.id %>\"> \
      <td> \
        <input type=\"<%= attr.type %>\" name=\"<%= attr.name %>\" value=\"<%= data.id %>\" class=\"<%= attr.class %>\"> \
        <%= data.name %> \
      </td> \
      <td><a class=\"deselect btn\" href=\"#\"><%= label.delete %></a></td> \
    </tr>";

  SS_SearchUI.defaultSelector = function ($item) {
    var self = this;

    var templateId = self.anchorAjaxBox.data("template"); 
    var templateEl = templateId ? document.getElementById(templateId) : null;
    var template, attr;
    if (templateEl) {
      //console.log("--------------------------------------SS_SearchUI.defaultSelector if(templateEl) true")
      template = templateEl.innerHTML;
      console.dir(template,{depth :null});
      attr = {};
    } else {
      console.log("--------------------------------------SS_SearchUI.defaultSelector if(templateEl) else")
      template = SS_SearchUI.defaultTemplate;

      var $input = self.anchorAjaxBox.closest("dl").find(".hidden-ids");
////////////////////メッセージ機能//////////////////////////////////////////////////////////////////////////////////////////////////
      if(selectTable=="to"){
        attr = { name: "item[in_to_members][]", type: $input.attr("type"), class: $input.attr("class").replace("hidden-ids", "") }
        console.log("--------------------------------------SS_SearchUI.defaultSelector attr to" + attr)
      }
      else if(selectTable=="cc"){
        attr = { name: "item[in_cc_members][]", type: $input.attr("type"), class: $input.attr("class").replace("hidden-ids", "") }
        console.log("--------------------------------------SS_SearchUI.defaultSelector attr cc" + attr)
      }
      else if(selectTable=="bcc"){
        attr = { name: "item[in_bcc_members][]", type: $input.attr("type"), class: $input.attr("class").replace("hidden-ids", "") }
        console.log("--------------------------------------SS_SearchUI.defaultSelector attr bcc" + attr)
      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else{
        attr = { name: $input.attr("name"), type: $input.attr("type"), class: $input.attr("class").replace("hidden-ids", "") }
        console.log("--------------------------------------SS_SearchUI.defaultSelector attr else" + attr)
      }
    }

    var $data = $item.closest("[data-id]");
    var data = $data[0].dataset;
    if (!data.name) {
      console.log("--------------------------------------SS_SearchUI.defaultSelector if(!data.name) true")
      data.name = $data.find(".select-item").text() || $item.text() || $data.text();
    }

    var tr = ejs.render(template, { data: data, attr: attr, label: { delete: i18next.t("ss.buttons.delete") } });
    console.log("--------------------------------------SS_SearchUI.defaultSelector var tr ")
    console.dir(tr, {depth: null});

///////////////メッセージの宛先変更/////////////////////////////////////////////////////////////////////////////////////////////////
   if (selectTable=="to"){
    var $ajaxSelected =self.anchorAjaxBox.closest("dl").find(".see.to .ajax-selected");
      console.log("--------------------------SS_SearchUI.defaultSelector to-checkbox true"); console.dir($ajaxSelected, {depth: null});
    }
    else if (selectTable=="cc"){
      var $ajaxSelected = self.anchorAjaxBox.closest("dl").find(".see.cc-bcc.cc .ajax-selected");
      console.log("--------------------------SS_SearchUI.defaultSelector cc-checkbox true"); console.dir($ajaxSelected, {depth: null});
    }
     else if (selectTable=="bcc"){
      var $ajaxSelected = self.anchorAjaxBox.closest("dl").find(".see.cc-bcc.bcc .ajax-selected");
      console.log("--------------------------SS_SearchUI.defaultSelector bcc-checkbox true"); console.dir($ajaxSelected, {depth: null});
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else{
      var $ajaxSelected = self.anchorAjaxBox.closest("dl").find(".ajax-selected");
      console.log("--------------------------SS_SearchUI.defaultSelector checkbox else"); console.dir($ajaxSelected, {depth: null});
    }
    
    //console.log("--------------------------------------SS_SearchUI.defaultSelector var $ajaxSelected ")
    //console.dir(self.anchorAjaxBox, {depth: null});
    $ajaxSelected.find("tbody").prepend(tr);
    $ajaxSelected.trigger("change");
  };

  SS_SearchUI.defaultDeselector = function (item) {
    var table = $(item).closest(".ajax-selected");
    var tr = $(item).closest("tr");
    tr.remove();
    
    if (table.find("tbody tr").size() === 0) {
      console.log("---------SS_SearchUI.defaultDeselector table " + table);console.dir(table, {depth: null});
      console.log("---------SS_SearchUI.defaultDeselector table.hide() ");
      table.hide();
    }
    table.trigger("change");
  };

  SS_SearchUI.select = function (item) {
    var selector = this.anchorAjaxBox.data('on-select');

    if (selector) {
      console.dir(item, { depth: null });
      return selector(item);
    } else {
      console.dir(item, { depth: null });
      return this.defaultSelector(item);
    }
  };

  SS_SearchUI.selectItems = function ($el) {
    if (! $el) {
      $el = $("#ajax-box");
    }
    var self = this;
////////////////////メッセージ機能/////////////////////////////////////////////////////////////////////////////////
    $el.find(".items .to-checkbox input:checkbox").filter(":checked").each(function () { 
      selectTable="to";
      selectTo++; 
      console.log("-----------------------------------SS_SearchUI.selectItems to-checkbutton")
      self.select($(this));
    });
    if(selectTo>0){
      self.anchorAjaxBox.closest("dl").find(".see.to .ajax-selected").show();
    }

    $el.find(".items .cc-checkbox input:checkbox").filter(":checked").each(function () {
      selectTable="cc";
      selectCc++; 
      console.log("-----------------------------------SS_SearchUI.selectItems cc-checkbutton")
      self.select($(this));
    });
    if(selectCc>0){
      self.anchorAjaxBox.closest("dl").find(".see.cc-bcc.cc .ajax-selected").show();
    }

    $el.find(".items .bcc-checkbox input:checkbox").filter(":checked").each(function () {
      selectTable="bcc";
      selectBcc++;
      console.log("-----------------------------------SS_SearchUI.selectItems bcc-checkbutton")
      self.select($(this));
    });
    if(selectBcc>0){
      self.anchorAjaxBox.closest("dl").find(".see.cc-bcc.bcc + .ajax-selected").show();
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $el.find(".items input:checkbox").filter(":checked").each(function () { 
      self.select($(this));
    });
      self.anchorAjaxBox.closest("dl").find(".ajax-selected").show();
  };

  SS_SearchUI.deselect = function (e) {
    var $item = $(this);
    console.log("-----------------------------SS_SearchUI.deselect $item "); console.dir($item, {depth: null});
     var selector = $item.closest(".ajax-selected").data('on-deselect'); 

    if (selector) {
      selector($item);
    } else {
      SS_SearchUI.defaultDeselector($item);
    }
    e.preventDefault();
  };

  SS_SearchUI.toggleSelectButton = function ($el) {
    if (! $el) {
      $el = $("#ajax-box");
    }

    if ($el.find(".items input:checkbox").filter(":checked").size() > 0) {
      return $el.find(".select-items").parent("div").show();
    }///メッセージ機能のとき

    else {
      return $el.find(".select-items").parent("div").hide();
    }
  };

  SS_SearchUI.render = function () {
    var self = this;

    $(".ajax-selected").each(function () {
      $(this).on("click", "a.deselect", self.deselect);
      console.log("------------------------SS_SearchUI.render on_click ")
      if ($(this).find("a.deselect").size() === 0) {
        $(this).hide();
      }
    });

    $(document)
      .on("cbox_load", self.onColorBoxLoaded)
      .on("cbox_cleanup", self.onColorBoxCleanedUp);
      selectTo=0,selectCc=0,selectBcc=0;
  };

  SS_SearchUI.onColorBoxLoaded = function (ev) {
    if (!SS_SearchUI.anchorAjaxBox) {
      // ファイル選択ダイアログの「編集」ボタンのクリックなどで別のモーダルが表示される場合がある。
      // 別のモーダルからキャンセルなどで戻ってきた際に、元々の anchor を利用したい。
      // そこで、初回表示時の anchor を記憶しておく。
      SS_SearchUI.anchorAjaxBox = $.colorbox.element();
    }
  };

  SS_SearchUI.onColorBoxCleanedUp = function (ev) {
    SS_SearchUI.anchorAjaxBox = null;
  };

  SS_SearchUI.modal = function (options) {
    if (!options) {
      options = {};
    }

    var self = this;
    var colorbox = options.colorbox || $.colorbox;
    var $el = options.$el || $("#ajax-box");
    var isSameWindow = (window == $el[0].ownerDocument.defaultView);
    if (isSameWindow) {
      $el.find("form.search").on("submit", function (ev) {
        var $div = $("<span />", { class: "loading" }).html(SS.loading);

        $(this).ajaxSubmit({
          url: $(this).attr("action"),
          success: function (data) {
            var $data = $("<div />").html(data);
            $.colorbox.prep($data.contents());
          },
          error: function (data, status) {
            $div.html("== Error ==");
          }
        });
        ev.preventDefault();
        return false;
      });
    }
    $el.find(".pagination a").on("click", function (ev) {
      self.selectItems($el);
      //console.log("-----------------modal.164 self.selectItems($el); " + self);
      if (isSameWindow) {
        $el.find(".pagination").html(SS.loading);
        $.ajax({
          url: $(this).attr("href"),
          type: "GET",
          success: function (data) {
            $el.closest("#cboxLoadedContent").html(data);
          },
          error: function (data, status) {
            $el.find(".pagination").html("== Error ==");
          }
        });

        ev.preventDefault();
        return false;
      } else {
        return true;
      }
    });
    $el.find("#s_group").on("change", function (ev) {
      self.selectItems($el);
      //console.log("-----------------modal.186 self.selectItems($el);" + self);
      return $el.find("form.search").submit();
    });
    $el.find(".submit-on-change").on("change", function (ev) {
      self.selectItems($el);
      //console.log("-----------------modal.191 self.selectItems($el);" + self);
      return $el.find("form.search").submit();
    });

    var $ajaxSelected = self.anchorAjaxBox.closest("dl").find(".ajax-selected");
    //console.log("-----------------modal.196 $ajaxSelected = self.anchorAjaxBox.parent().find('.ajax-selected'); "); console.dir($('ajaxSelected'));
    if (!$ajaxSelected.length) {
      $ajaxSelected = self.anchorAjaxBox.parent().find(".ajax-selected");
    }
    $ajaxSelected.find("tr[data-id]").each(function () {
      var id = $(this).data("id");
      //console.log("-----------------modal.202 var id" + id);
      var tr = $("#colorbox .items [data-id='" + id + "']");
      //console.log("-----------------modal.204  var tr" + tr);
      tr.find("input[type=checkbox]").remove();
      tr.find(".select-item,.select-single-item").each(function() {
        var $this = $(this);
        //console.log("-----------------modal.208 var $this = $(this);" + $('this'));
        var html = $this.html();
        //console.log("-----------------modal.210 var html = $this.html();" + html);

        var disabledHtml = $("<span />", { class: $this.prop("class"), style: 'color: #888' }).html(html);
        //console.log("-----------------modal.213 var disabledHtml = $('<span />', { class: $this.prop('class'), style: 'color: #888' }).html(html); "); console.dir(disabledHtml, { depth: null });
        $this.replaceWith(disabledHtml);
      });
    });
    $el.find("table.index").each(function() {
      SS_ListUI.render(this);
      //console.log("-----------------modal.219 SS_ListUI.render(this);")
    });
    $el.find("a.select-item").on("click", function (ev) {
      if (!SS.disableClick($(this))) {
        return false;
      }
      // self.select() を呼び出した際にダイアログが閉じられ self.anchorAjaxBox が null となる可能性があるので、事前に退避しておく。
      var ajaxBox = self.anchorAjaxBox;
      //console.log("-----------------modal.227 var ajaxBox = self.anchorAjaxBox; " + ajaxBox);
      console.dir(ajaxBox, { depth: null });
      //append newly selected item
      self.select($(this));
      //console.log("-----------------modal.230 self.select($(this)); " + self);
      ajaxBox.closest("dl").find(".ajax-selected").show();
      ev.preventDefault();
      colorbox.close();
      return false;
    });
    //remove old items
    $el.find(".select-single-item").on("click", function (ev) {
      if (!SS.disableClick($(this))) {
        return false;
      }
      // self.select() を呼び出した際にダイアログが閉じられ self.anchorAjaxBox が null となる可能性があるので、事前に退避しておく。
      var ajaxBox = self.anchorAjaxBox;
      //console.log("-----------------modal.243 var ajaxBox = self.anchorAjaxBox; " + ajaxBox);
      ajaxBox.closest("dl").find(".ajax-selected tr[data-id]").each(function () {
        if ($(this).find("input[value]").length) {
          return $(this).remove();
        }
      });
      //append newly selected item
      self.select($(this));
      //console.log("-----------------modal.251 self.select($(this)); " + self);
      ajaxBox.closest("dl").find(".ajax-selected").show();
      ev.preventDefault();
      colorbox.close();
      return false;
    });
    $el.find(".select-items").on("click", function (ev) {
      if (!SS.disableClick($(this))) {
        return false;
      }
      self.selectItems($el);
      //console.log("-----------------modal.262 self.selectItems($el); " + self);
      ev.preventDefault();
      colorbox.close();
      return false;
    });
    $el.find(".index").on("change", function (ev) {
      return self.toggleSelectButton($el);
    });
    return self.toggleSelectButton($el);
  };
  //console.log("-----------------modal.272 return SS_SearchUI;")
  return SS_SearchUI;

})();
