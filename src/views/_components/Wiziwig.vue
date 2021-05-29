<template>
    <div :style="style">
        <quill-editor class="quill-editor" :style="css" :ref="type" v-model="message" :options="editorOption" v-if="editorOption" @change="onEditorChange($event)"/>
        <vs-button @click="buttonEnter" class="float-right mt-2" v-if="submit==='button'">{{ buttonLabel }}</vs-button>
    </div>
</template>

<script>
import * as Emoji from "quill-emoji";
import Quill from 'quill';
Quill.register("modules/emoji", Emoji);
import "quill-emoji/dist/quill-emoji.css";
import moment from "moment";

export default {
    name: "Wiziwig",
    props: {
        content: {
            type: String,
        },
        placeholder: {
            type: String,
            default: "Enter message here",
            required: true,
        },
        type: {
            type: String,
            default: "WIZIWIG",
        },
        buttonLabel: {
            type: String,
            default: "POST",
        },
        success: {
            type: moment
        },
        submit: {
            type: String,
            default: "button" //options "button" "keyup" "sync"
        },
        theme: {
            type: String,
            default: "boxed" //options "boxed" "unboxed" "unboxed-white"
        },
        editorTheme: {
            type: String,
            default: "bubble" //options "bubble" "snow"
        },
        style: {
          type: String,
          default: 'display: inline-block; width: 100%'
        }
    },
    data: () => ({
        message: "",
        editorOption: null,
        css: "",
    }),
    methods:{
        onEditorChange({html}) {
            if(this.type){
                localStorage[this.type] = JSON.stringify(html)
            }
            if(this.submit === 'sync'){
                this.$emit('submitted', this.message)
            }
        },
        buttonEnter() {
            this.$emit('submitted', this.message)
        },
        keyupEnter() {
            if(this.submit === 'keyup'){
                this.$emit('submitted', this.message)
            }else{
                this.message = this.message + '<br>'
            }
        },
    },
    computed: {
        editor() {
            return this.$refs[this.type].quill
        }
    },
    watch: {
        success() {
            this.message = ''
        }
    },
    async created() {
        if(this.type && localStorage[this.type]){
            this.message = JSON.parse(localStorage[this.type])
        }
    },
    mounted() {

        switch(this.theme){
            case 'boxed':
                this.css = ' border: 1px solid rgba(0, 0, 0, 0.2) !important; background: #FFFFFF; '
                break
            case 'unboxed':
                this.css = ' border: 0px; '
                break
            case 'unboxed-white':
                this.css = ' border: 0px; background: #FFFFFF; '
                break
            case 'unboxed-white-r10':
                this.css = ' border: 0px; background: #FFFFFF; border-radius: 10px'
                break
        }

        if(this.content){
            this.message = this.content
        }

        const that = this;
        this.editorOption = {
            theme: this.editorTheme,
            placeholder: this.placeholder,
            modules: {
                keyboard: {
                    bindings: {
                        enter: {
                            key: 13,
                            handler: function () {
                                that.keyupEnter()
                            }
                        }
                    }
                },
                history: { // Enable with custom configurations
                    userOnly: true,
                    'delay': 2500,
                },
                toolbar: {
                    container: [
                        ['bold', 'italic', 'underline'],
                        ['emoji'],
                        [{'header': 1}, {'header': 2}, 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['link', 'video'],
                    ],
                },
                "emoji-toolbar": true,
                "emoji-textarea": false,
                "emoji-shortname": true,
            },
        }
    }
}

</script>
<style>
.quill-editor {
    border-radius: 4px;
    margin: 0;
}

.ql-container {
    font-family: Roboto, "Nunito Sans", sans-serif;
    font-size: 12px;
    font-style: normal;
}
.ql-bubble .ql-toolbar .ql-formats {
    margin: 6px 10px 6px 0px;
}

.ql-bubble.ql-toolbar button, .ql-bubble .ql-toolbar button {
    width: 20px
}

.ql-tooltip{
    width: 310px;
    z-index: 99999;
}

#emoji-palette {
    z-index: 999999;
}

.emoji_completions{
    z-index: 9;
}

.ql-editor.ql-blank:before {
    font-style: normal;
}

.ap{
    margin-top: 0px;
}


</style>
