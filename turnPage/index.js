
(function () {

    function TurnPage(options) {
        this.wrap = options.wrap;
        this.curPage = options.curPage || 1;
        this.allPage = options.allPage || 1;
        this.changePage = options.changePage || function () {};

        if (this.curPage > this.allPage) {
            alert('请输入正确页码');
            return false;
        }
        this.fillHTML();
        this.bindEvent();
    }
    TurnPage.prototype.fillHTML = function () {
        $(this.wrap).empty();
        // 添加上一页按钮
        if (this.curPage > 1) {
            $(this.wrap).append($('<li class="prev-page">上一页</li>'));
        } else {
            $(this.wrap).remove('.prev-page');
        }

        // 填充中间页 
        // 如果当前页不是第一页  并且当前页与第一页之间差2页以及两页以上  添加第一页
        if (this.curPage != 1 && this.curPage - 2 > 1) {
            $(this.wrap).append($('<li class="tab-number">1</li>'));
        }

        // 如果当前页的前两页 大于第二页 则出现省略号
        if (this.curPage - 2 > 2) {
            $(this.wrap).append($('<span>...</span>'));
        }

        // 渲染当前页数左右两页
        for (var i = this.curPage - 2; i <= this.curPage + 2; i++) {
            // 当前页要在1-allPage之间
            if(i > 0 && i <= this.allPage) {
                var oLi = $('<li class="tab-number">' + i + '</li>');
                if (i == this.curPage) {
                    oLi.addClass('cur-page')
                }
                $(this.wrap).append(oLi);
            }
        }
        // 当前页数与最后一页之间搁三页及以上出现省略号
        if (this.allPage - this.curPage > 3) {
            $(this.wrap).append($('<span>...</span>'));
        }
        // 添加最后一页
        if (this.curPage + 2 < this.allPage) {
            $('<li class="tab-number">' + this.allPage + '</li>').appendTo($(this.wrap));
        }

        // 添加下一页按钮
        if (this.curPage < this.allPage) {
            $(this.wrap).append($('<li class="next-page">下一页</li>'));
        } else {
            $(this.wrap).remove('.next-page');
        }


    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        $('.prev-page', this.wrap).click(function (e) {
            self.curPage --;
            self.change();
        });
        $('.next-page', this.wrap).click(function () {
            self.curPage ++;
            self.change();
        });
        $('.tab-number', this.wrap).click(function () {
            var curPage = parseInt($(this).text());
            self.curPage = curPage;
            self.change();
        });
    }
    TurnPage.prototype.change = function () {
        this.fillHTML();
        this.bindEvent();
        this.changePage(this.curPage);
    }





    $.fn.extend({
        turnPage: function (options) {
            options.wrap = this;
            new TurnPage(options);
            return this;
        }
    })
}())