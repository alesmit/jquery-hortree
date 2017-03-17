/*
 *  jquery-hortree - v1.0.0
 *  Render an horizontal hierarchical tree from a JSON schema.
 *  https://github.com/alesmit/jquery-hortree
 *
 *  Made by Alessandro Mitelli
 *  Under MIT License
 */
;(function ($, window, document, undefined) {

    "use strict";

    var entryIdIndex = 0;

    function branch(list) {
        var html = [];
        html.push('<div class="hortree-branch">');
        $(list).each(function () {
            html.push(branchList(this));
        });
        html.push('</div>');
        return html.join("\n");
    }

    function branchList(elem) {
        entryIdIndex++;
        var html = [];
        html.push('<div class="hortree-entry" data-entry-id="' + entryIdIndex + '">');
        html.push('<div class="hortree-label">' + elem.description + '</div>');
        if (elem.children.length) {
            html.push(branch(elem.children));
        }
        html.push('</div>');
        return html.join("\n");
    }

    /**
     * prevent entries overlap:
     * each branch height should be equal to the total heights of its children entries
     */
    function assignBranchHeight() {

        // get entries unsorted
        var unsortedEntries = [];
        $('.hortree-entry').each(function () {
            var entryId = $(this).attr('data-entry-id');
            unsortedEntries.push({
                entryId: parseInt(entryId),
                entry: $(this)
            })
        });

        // sort entries by rendering order
        var entries = unsortedEntries.slice(0);
        entries.sort(function (a, b) {
            return a.entryId - b.entryId;
        });

        // get it in reverse order
        entries.reverse();

        // iterate each entry
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i].entry;
            var children = entry.children('.hortree-branch');

            // if this entry has a branch (it has children entries)
            if (!!children.length) {

                // sum each child entry height
                var h = 0;
                children.each(function () {
                    h += $(this).height();
                });

                // and give it to the parent
                entry.height(h);

            }
        }

    }

    /**
     * draw lines schema between entries
     * @param options
     */
    function drawLines(options) {

        // get native element position
        function getPos(el) {
            for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
            return {x: lx, y: ly};
        }

        // draw lines for each hierarchical tree in the page
        $('.hortree-wrapper').each(function () {
            var tree = $(this);

            var offsetY = 0; // offset Y is set on first element iteration
            var elementIndex = 0;

            // iterate over entries content
            tree.find('.hortree-label').each(function () {

                // set Y offset pos where to render each line
                if (elementIndex == 0) {
                    var offsetTop = $(this).offset().top;
                    offsetY = (offsetTop * -1) + 20;
                }

                // if it has children then draw line
                if (!!$(this).siblings('.hortree-branch').length) {

                    // parent position
                    var parentPos = getPos($(this).get(0));

                    // get position of each child
                    $(this).siblings('.hortree-branch')
                        .children('.hortree-entry')
                        .children('.hortree-label')
                        .each(function () {

                            var childPos = getPos($(this).get(0));

                            // draw line between two points
                            tree.line(
                                parentPos.x + $(this).width() - 10,
                                parentPos.y + offsetY,
                                childPos.x,
                                childPos.y + offsetY,
                                {
                                    zindex: options.lineZindex,
                                    color: options.lineColor,
                                    stroke: options.lineStrokeWidth
                                });

                        })

                }

                elementIndex++;

            })

        });
    }

    /**
     * set each entry height based on its label content
     */
    function assignEntryHeight() {
        $('.hortree-label').each(function () {
            var h = $(this).height();
            $(this).parent('.hortree-entry').height(h);
        });
    }

    /**
     * The plugin
     * @param opts
     */
    $.fn.hortree = function (opts) {
        opts = opts || {};

        // default options
        var defaults = {
            lineStrokeWidth: 2,
            lineZindex: 8,
            lineColor: '#4b86b7',
            data: [],
            onComplete: function () {
                // onComplete callback
            }
        };

        var options = $.extend(defaults, opts);

        if (!$.fn.line) {
            throw new Error("You must load jquery.line.js library! Get it here: https://github.com/tbem/jquery.line");
        }
        else if (!options.data) {
            throw new Error("No data specified!");
        }
        else if (!(options.data instanceof Array)) {
            throw new Error("Data should be an array");
        }
        else if (!options.data.length) {
            console.warn("Data is empty");
        }

        var html = [];
        html.push('<div class="hortree-wrapper">');
        html.push(branch(options.data));
        html.push('</div>');

        this.html(html.join('\n'));

        assignEntryHeight();
        assignBranchHeight();
        drawLines(options);

        // execute onComplete callback
        if (!!options.onComplete && typeof options.onComplete === 'function') {
            options.onComplete.apply();
        }

    }

})(jQuery, window, document);
