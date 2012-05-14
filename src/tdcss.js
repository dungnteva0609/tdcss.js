var tdcss = (function ($) {
    "use strict";

    var settings = {
            fragment_identifier: "### ",
            fragment_info_splitter: "; "
        },
        module = {
            fragments: []
        };

    function init() {
        setupTestSuite();
        parseRawFragments();
        renderFragments();
    }

    function setupTestSuite() {
        $("#tdcss")
            .wrapInner("<div id='fragments'></div>")
            .append('<table id="elements"></table>');
    }

    function parseRawFragments() {
        var fragments = getRawFragments();

        fragments.each(function(){
            var fragment = {
                title: getFragmentTitle(this),
                section: getFragmentSection(this),
                height: getFragmentHeight(this),
                html: getFragmentHTML(this)
            };

            if (fragment.html) {
                module.fragments.push(fragment);
            }
        })
    }

    function getRawFragments() {
        return $("body #fragments").contents().filter(
            function() {
                return this.nodeType === 8 && this.nodeValue.match(new RegExp(settings.fragment_identifier));
            }
        );
    }

    function getFragmentTitle(e) {
        var title = getFragmentMeta(e)[0];
        if (typeof title !== "undefined"){
            return title.trim();
        } else {
            return null;
        }
    }

    function getFragmentSection(e) {
        var section = getFragmentMeta(e)[1];
        if (typeof section !== "undefined"){
            return section.trim();
        } else {
            return null;
        }
    }

    function getFragmentHeight(e) {
        var height = getFragmentMeta(e)[2];
        if (typeof height !== "undefined"){
            return height.trim();
        } else {
            return false;
        }
    }

    function getFragmentMeta(e) {
        var raw_meta = e.nodeValue.split(settings.fragment_identifier)[1];
        return raw_meta.split(settings.fragment_info_splitter);
    }

    function getFragmentHTML(e) {
        // The actual HTML fragment is the comment's nextSibling (a carriage return)'s nextSibling:
        var fragment = e.nextSibling.nextSibling;

        // Check if nextSibling is a comment or a real html fragment to be rendered
        if (fragment.nodeType !== 8) {
            return fragment.outerHTML;
        } else {
            return null;
        }
    }

    function renderFragments() {
        var last_section_name;

        for (var i = 0; i < module.fragments.length; i++) {
            var fragment = module.fragments[i];

            if (fragment.section) {
                if (fragment.section !== last_section_name) {
                    addNewSection(fragment.section);
                    last_section_name = fragment.section;
                }
            }
            addNewFragment(fragment);
        }
    }

    function addNewSection(section_name) {
        $("#elements").append('<tr class="section"><td colspan="2"><h2>' + section_name + '</h2></td></tr>');
    }

    function addNewFragment(fragment) {
        var title = fragment.title || '',
            html = fragment.html,
            height = fragment.height || 'auto',
            $row = $("<tr class='fragment'></tr>")
                    .append("<td style='height:" + height + "'>" + html + "</td>")
                    .append("<td><h3>" + title + "</h3><textarea readonly>" + html + "</textarea></td>");

        $("#elements").append($row);
    }

    module.init = function () {
        init();
    };

    return module;
}($));
