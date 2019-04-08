Vue.component('product-details', {
    propos: {
        details: {
            type: Array,
            required: true,
        }
    },

    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,

    data() {
        return {
            details: ['80% Cotton', '20% Polyester', 'Gender-neutral' ],
        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },

    template: `
        <div class="product">

            <div class="product-image">
                <img :src="image"/>
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else="inStock" :class="{textDecoration: !inStock}" >Out Stock</p>
        <!--                 <p v-if="inventory > 10" >In Stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0" >Amost sold Out</p>
                <p v-else="inventory" >Out Stock</p> -->
        <!--                <p v-if="onSale">On Sale</p> -->

                <p>Shipping: {{shipping}}</p>

                <product-details></product-details>

                <span v-for="size in sizes" > | {{size}}</span>
                
                    <div v-for="(variant, index) in variants" :key="variant.variantId"
                        class="color-box" :style="{ backgroundColor: variant.variantColor}"
                        @mouseover="updateProduct(index)"
                        >
                    </div>

                    <div>
                        <button @click="addToCart" 
                        :disabled="!inStock" :class="{disabledButton: !inStock}" 
                        >Add to Cart </button>

                        <button @click="removeFromCart" 
                        >Remove from cart</button>
                    </div>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>

        </div>

    `,
    
    data() {
        return {
                brand: 'Vue Mastery',
                product: 'Socks',
        
                selectedVariant: 0,
        
                inventory: 0,
                variants: [
                    {   variantId: 2234, 
                        variantColor: 'green',
                        variantImage: './assets/socks-blue.jpg',
                        variantQuantity: 10
                    },
                    {   variantId: 2235,
                        variantColor: 'blue',
                        variantImage: './assets/socks-green.jpg',
                        variantQuantity: 0
                    },
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                onSale: true,
                reviews: [],
        }
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },

        updateProduct(index) {
            this.selectedVariant = index;
        },

        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },

    computed: {
        title() {
            return this.brand + ' '+this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },

        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        
        sale() {
            if(this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!';
            }
            return this.brand + ' ' + this.product + ' are not on sale';
        },

        shipping(){
            if(this.premium) {
                return 'Free';
            }
            return '$2.99';
        }


    }
})





Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{error}}</li>
                </ul>
            </p>

            <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
            </p>
            <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
            </p>

         
            <p>Would you recommend this product?</p>
            <label> Yes
                <input type="radio" value="Yes" v-model="recommend"/>
            </label>
            <label> No
                <input type="radio" value="No" v-model="recommend"/>
            </label>
         

            <p>
            <input type="submit" value="Submit">
            </p>
        </form>
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        };
    },

    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                this.$emit('review-submitted', productReview)
                this.name = null,
                this.review = null,
                this.rating = null
            }
            else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required.")
            }
        },
    }
})


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true,
        }
    }, 

    template: `
        <div>
            <span class="tab"
            :class="{ activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs" :key="index"
            @click="selectedTab = tab">{{tab}}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{review.name}}</p>
                    <p>Rating: {{review.rating}}</p>
                    <p>{{review.review}}</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Reviews'"></product-review>

    `,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


var app = new Vue({
    el: '#app',


    data: {
        premium: false,
        cart: [],
    },

    methods: {
        updateCart(id) {
            this.cart.push(id);
        },

        removeItem(id) {
            for(var i = this.cart.length -1; i>=0; i--) {
                if(this.cart(i) === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }

})