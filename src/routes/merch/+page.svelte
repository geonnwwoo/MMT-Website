<script>
    /** @type {import('./$types').PageData} */
    import PageHeader from "$lib/components/PageHeader.svelte";
    import PanelBox from "$lib/components/PanelBox.svelte"
    import { onMount } from 'svelte';

  const SHOPIFY_DOMAIN = 'tuig05-bz.myshopify.com';
  const SHOPIFY_ACCESS_TOKEN = '372e80b1413b495d95754f77e103fd31';



  let productNodes = [];

  onMount(() => {
    const mountShopifyButtons = () => {
      const client = ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: SHOPIFY_ACCESS_TOKEN
      });

      ShopifyBuy.UI.onReady(client).then(function (ui) {
        products.forEach((product, index) => {
          const node = productNodes[index];

          if (!product.shopifyId || !node) {
            return;
          }

          ui.createComponent('product', {
            id: product.shopifyId,
            node,
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
          "product": {
            "contents": {
              "details": true,
              "title": false,
              "price": false
            },
            "templates": {
              "details": `<div class="{{data.classes.product.details}}">
                            <span class="{{data.classes.product.title}}" data-element="product.title">{{data.title}}</span>
                            <span class="{{data.classes.product.price}}" data-element="product.price">{{data.formattedPrice}}</span>
                          </div>`
            },
            "order": [
              'img',
              'title',
              'price',
              'details',
              'options',
              'quantity',
              'button'
            ],
            "classes": {
              "details": 'product-details'
            },
            "styles": {
              "img": {
                "border-radius": "10px",
                "aspect-ratio": "3/4",
                "object-fit": "cover",
                "width": "100%"
              },
              "options": {
                "max-width": '100% !important'
              },
              "details": {
                "padding": '10px',
                "margin": '10px auto',
                "border-radius": '10px',
                "background-color": '#f1f5f9'
              },
              "title": {
                "display": 'block',
                "text-align": 'left',
                "font-size": '1.5rem',
                "font-weight": '700',
                "color": 'black',
                "width": '100%'
              },
              "price": {
                "display": 'block',
                "text-align": 'left',
                "font-size": '2rem',
                "font-weight": '200',
                "color": '#333',
                "width": '100%'
              },
              "button": {
                "width": '100%',
                "margin": '20px',
                "border-radius": '10px',
                "background-color": '#1B9AAA',
                "color": "white",
                ":hover": {
                  "background-color": '#167d8a'
                }
              },
              "product": {
                "width": '100%',
                "font-family": '"Ubuntu", "Roboto", Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important'
              }
            },
            "text": {
              "button": "Add to cart"
            }
          },
          "productSet": {
            "styles": {
              "products": {
                "@media (min-width: 601px)": {
                  "margin-left": "-20px"
                }
              }
            }
          },
          "modalProduct": {
            "contents": {
              "img": false,
              "imgWithCarousel": true,
              "button": false,
              "buttonWithQuantity": true
            },
            "text": {
              "button": "Add to cart"
            }
          },
          "option": {
            "styles": {
              "wrapper": {
                "border-radius": '10px',
                "width": 'fit-content',
              },
              "select": {
                "width": 'fit-content',
                "padding": '5px 20px',
                "margin-right": '10px',
                "color": 'black'
              },
              "label": {
                "width": "10px"
              }
            }
          },
          "cart": {
            "styles": {
              "cart": {
                "font-family": '"Ubuntu", "Roboto", Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important'
              },
              "button": {
                "background-color": '#1c6825',
                ":hover": {
                  "background-color": '#1c6825'
                }
              }
            },
            "text": {
              "total": "Subtotal",
              "button": "Checkout"
            }
          },
          "toggle": {
            "styles": {
              "toggle": {
                "background-color": '#1c6825',
                ":hover": {
                  "background-color": '#1c6825'
                }
              }
            }
          }
        }
          });
        });
      });
    };

    if (window.ShopifyBuy?.UI) {
      mountShopifyButtons();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.onload = mountShopifyButtons;
    document.body.appendChild(script);
  });

  const products = [
        {
            title: "Hoodies - Dark Gray",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8933272289433',
        },
        {
            title: "Hoodies - Turquoise",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8933258035353',
        },
        {
            title: "MMT 2026 Shirt - Light Blue",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8933272584345',
        },
        {
            title: "MMT 2026 Shirt - Dark Blue",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8933272715417',
        },
        {
            title: "MMT 2025 Shirt - Gray",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8933272780953',
        },
        {
            title: "MMT 2024 Shirt - Light Green",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8933272879257',
        }
    ]
</script>

<svelte:head>
	<title>Mustang Math Merch</title>
</svelte:head>

<PageHeader
	title="Merch"
	description="Shop Mustang Math Merch"
	button_url="#products"
	button_text="Shop Now"
	id=""
/>

<div class="product-grid" id="products">
  {#each products as product, index}
        <PanelBox borderRadius="12px" style="display: flex; flex-direction: column; opacity: 1;">
            <!-- <div class="image-container">
                <img class="image" src={product.image} alt={product.alt} loading="lazy"/> product image -->
            <!-- </div> -->
      <div class="shopify-button" bind:this={productNodes[index]}></div>
        </PanelBox>
    {/each}
</div>


<style>

.product-grid{
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fill, minmax(max(min(100%, 400px), 25%), 1fr));
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 5px 10px 10px rgb(0, 0, 0, 0.1);
    opacity: 0.8;
    transition: 0.5s;
    margin: 10px;
    padding: 10px;
    gap: 10px;
}


.image-container {
    display: flex;
    aspect-ratio: 3 / 4;
    width: 100%;
    overflow: hidden;
    align-self: center;
    justify-content: center;
    align-items: center;
}

.image {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    transition: 0.3s;
}
.image:hover {
    transform: scale(1.05);
}

.shopify-button {
  max-width: 100% !important;
  width: 100% !important;
}

</style>