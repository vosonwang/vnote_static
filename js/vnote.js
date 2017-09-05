/**
 * Created by voson on 2017/4/24.
 */



/*不显示进度环*/
NProgress.configure({showSpinner: false});

/*设置提示插件的显示位置和存在时间*/
toastr.options = {
    "positionClass": "toast-top-center",
    "timeOut": "1000",
    "preventDuplicates": true,
    "showMethod": "slideDown",
    "hideMethod": "fadeOut"
};

moment.locale('zh-cn');

let vaste = new Vue({
    el: '#note',
    data: {
        note: "",
        record: {},
        shortId: location.href.split("/", 4)[3],
        notes: []
    },
    mounted: function () {
        this.$nextTick(function () {

            this.findByShortID();

        });
        this.getAllNotes();

    },
    computed: {
        formatNote: function () {
            let _self = this, key = 'updatetime';
            if (this.notes.length !== 0) {
                return bubbleSort(_self.notes, key).filter(function (a) {
                    if (a.updatetime !== null) {
                        a.updatetime = moment(a.updatetime).fromNow();
                    }
                    a.createtime=moment(a.createtime).format("MMM Do YYYY");
                    if (a.note !== null && a.note.length > 60) {
                        a.note = a.note.slice(0, 60)+"...";
                    }
                    return a;
                })
            } else {
                return null;
            }
        }
    },
    methods: {
        //根据id查找note
        findByShortID: function () {
            let _self = this;

            /*nginx接收两种关于vnote.html的请求：domain/1234和domain/vnote.html 下面的判断即是确定如果是前者的话积极执行ajax请求*/
            /*domain/1234会被转成doamin?id=1234*/
            if (/\d{1,4}/i.test(_self.shortId)) {
                $.ajax({
                    type: "get",
                    url: "/notes/" + _self.shortId,
                    beforeSend: function () {
                        NProgress.start();
                    },
                    success: function (data) {
                        if (data !== null && data !=='') {
                            _self.record = data;
                            _self.note = data.note;
                        } else {
                            console.log(data);
                        }
                    },
                    error: function (data) {
                        toastr.error("获取内容失败！");
                        console.log(data)
                    },
                    complete: function () {
                        NProgress.done();
                    }
                })
            }

        },

        /*新建一条笔记，获取一个新的id号*/
        create: function () {
            $.ajax({
                type: "post",
                url: "/shortids",
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null && data !=='') {
                        window.location.href = "/" + data;
                    } else {
                        toastr.error("新建笔记失败！");
                        console.log(data);
                    }
                },
                error: function (data) {
                    toastr.error("获取内容失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        },


        /*获取所有的note*/
        getAllNotes: function () {
            let _self = this;
            $.ajax({
                type: "get",
                url: "/notes",
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (data !== null && data !== "") {
                        _self.notes = data;
                    } else {
                        toastr.error("获取内容失败！");
                        console.log(data);
                    }
                },
                error: function (data) {
                    toastr.error("获取内容失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        },

        //保存 1.记录已存在，update数据 2.新记录，create数据
        save: function () {
            let _self = this;
            if(_self.note!==""){
                $.ajax({
                    type: "post",
                    url: "/notes",
                    data: {note: _self.note, shortId: _self.shortId},
                    beforeSend: function () {
                        NProgress.start();
                    },
                    success: function (data) {
                        if (data !== null && data !=='') {
                            toastr.success("保存成功！");
                            _self.record = data;
                        }else {
                            toastr.error("保存失败！");
                        }
                    },
                    error: function (data) {
                        toastr.error("保存失败！");
                        console.log(data)
                    },
                    complete: function () {
                        NProgress.done();
                    }
                })
            }

        },

        //删除note
        deleteNote: function () {
            let _self = this;

            $.ajax({
                type: "DELETE",
                url: "/notes/" + _self.shortId,
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (data) {
                    if (typeof data === 'number') {
                        if (data === 0) {
                            toastr.warning("该记录不存在！");
                        } else {
                            window.location.href = "/list.html";
                        }
                    } else {
                        console.log(data);
                    }
                },
                error: function (data) {
                    toastr.error("获取内容失败！");
                    console.log(data)
                },
                complete: function () {
                    NProgress.done();
                }
            })
        }

    }

});

