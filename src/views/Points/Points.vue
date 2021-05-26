<template>
    <section>
        <vs-row class="mt-2 ml-1" v-if="points.points">
            <span>You have <span style="text-decoration: underline; text-decoration-color: var(--primary); text-decoration-thickness: 2px; font-weight: bold; color: black ">{{ points.points }}</span> point<span v-if="points.points > 1">s</span> to spend:</span>
        </vs-row>


        <vs-row class="mt-3">
            <vs-col
                type="flex"
                vs-justify="center"
                vs-align="center"
                vs-lg="4"
                vs-xs="12"
                v-for="(product, p) in productGrid"
                :key="p"
            >
                <vs-card class="text-center">
                    <img
                        :src="productImage(product)"
                        :alt="product.name"
                        class="rounded-circle"
                        width="100"
                    />
                    <h4 class="card-title mt-3 mb-0">{{ product.name }} <span v-if="product.sizes">({{productSize(product)}})</span></h4>
                    <small class="text-muted">{{ product.type }}</small>

                    <div class="mt-3" v-if="product.colors">
                        <span
                            v-for="(color, c) in product.colors"
                            :key="c"
                        >
                                <vs-avatar
                                    @click="changeColor(p, c)"
                                    :color="color.hex" text=" "
                                    :style="[
                                        color.hex === '#FFFFFF' ? {'border': '#2b2b2b 1px solid'} : {},
                                        color.selected ? {'width': '35px', 'height': '35px'} : {},
                                    ]"

                                />
                            </span>
                    </div>

                    <div class="mt-3" v-if="product.sizes">
                        <span
                            v-for="(size, s) in product.sizes"
                            :key="s"
                        >
                                <vs-avatar
                                    @click="changeSize(p, s)"
                                    color="light"
                                    text-color="grey"
                                    :text="size.name"
                                    :style="[
                                        size.selected ? {'width': '35px', 'height': '35px', 'border': 'grey 1px solid'} : {},
                                    ]"

                                />
                            </span>
                    </div>

                    <div class="mt-3">
                        <vs-button color="primary" type="filled" :disabled="product.points > points.points">{{numberFormatThousands(product.points)}} Points</vs-button>
                        <vs-button color="success" type="filled" class="ml-3">${{ currencyDecimal(product.price) }}</vs-button>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>


    </section>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {readPoints} from "@/controllers/points";
import {numberFormatThousands, currencyDecimal} from "@/functions/utils/currency";
import products from "@/assets/products.json";

export default {
    name: "Points",
    data: () => ({
        superhero: {},
        points: false,
        products: [...products]
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.runner()
    },
    methods: {
        runner: async function () {
           await this.getPoints()
        },
        getPoints: async function () {
            this.points = await readPoints(this.superhero.name)
        },
        productImage: function(product){

            let image = product.id

            for(const c in product.colors){
                if(product.colors[c].selected){
                    image += `_${product.colors[c].name}`
                }
            }

            return require(`@/assets/images/products/${image}.jpeg`)
        },
        productSize: function(product){
            for(const s in product.sizes){
                if(product.sizes[s].selected){
                    return product.sizes[s].name
                }
            }
        },
        changeColor(product_index, color_index){
            let products = this.products

            for(const pi in products){
                if(pi == product_index){
                    for(const ci in products[pi].colors){
                        products[pi].colors[ci].selected = ci == color_index;
                    }
                }
            }
            this.$set(this, 'products', products)
        },
        changeSize(product_index, size_index){
            let products = this.products

            for(const pi in products){
                if(pi == product_index){
                    for(const si in products[pi].sizes){
                        products[pi].sizes[si].selected = si == size_index;
                    }
                }
            }
            this.$set(this, 'products', products)
        },
        numberFormatThousands(value) {
            return numberFormatThousands(value)
        },
        currencyDecimal(value){
            return currencyDecimal(value)
        }
    },
    computed: {
        productGrid() {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            return this.products.sort((a, b) => a.points - b.points)
        }
    },
}
</script>

<style scoped>

</style>
