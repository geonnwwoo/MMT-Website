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
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "calc(25% - 20px)",
                  "margin-left": "20px",
                  "margin-bottom": "50px"
                }
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
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0px",
                  "margin-bottom": "0px"
                }
              }
            },
            "text": {
              "button": "Add to cart"
            }
          },
          "option": {},
          "cart": {
            "text": {
              "total": "Subtotal",
              "button": "Checkout"
            }
          },
          "toggle": {}
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
            <h2 class="title">{product.title}</h2>
            <div class="image-container">
                <img class="image" src={product.image} alt={product.alt} loading="lazy"/> <!--product image-->
            </div>
      <div class="shopify-button" bind:this={productNodes[index]}></div>
        </PanelBox>
    {/each}
</div>


<style>

h2 {
    font-weight: 800;
    font-size: 1.8rem;
    color: #333;
}

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
  margin-top: 15px;
}
</style>