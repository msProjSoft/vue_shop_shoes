Vue.component('lixo', {

    props: {
        message: {
            type: String,
            required: true,
            default: 'Hi'
        },
        post: {
            type: String,
            required: false,
            default: 'no post'
        }
    },

    template: `
    <div>
        <h1> One component..</h1>
        <h1>{{ message }}</h1>
        <h1>{{ post }}</h1>
    </div>
    `,

    data() {
        return {

        }
    }

}) 