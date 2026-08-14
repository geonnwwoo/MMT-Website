<script>
    /** @type {import('./$types').PageData} */
    import PageHeader from "$lib/components/PageHeader.svelte";
    import PanelBox from "$lib/components/PanelBox.svelte"
    import { onMount } from 'svelte';

  const SHOPIFY_DOMAIN = 'qz6ccd-90.myshopify.com';
  const SHOPIFY_ACCESS_TOKEN = '04493c9575f1d96d8529ec2caabdaecc';



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
              product: {
                contents: {
                  img: false,
                  title: false,
                  price: false,
                  button: true,
                  description: false,
                  quantity: false,
                  options: false
                },
                text: {
                  button: 'Add to cart'
                },
                styles: {
                  button: {
                    'background-color': '#333333',
                    color: '#ffffff',
                    'border-radius': '12px',
                    'font-weight': '700',
                    padding: '0.9rem 1.2rem',
                    ':hover': {
                      'background-color': '#111111'
                    }
                  }
                }
              },
              cart: {
                text: {
                  total: 'Subtotal',
                  button: 'Checkout'
                }
              },
              toggle: {}
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
            title: "Shirt",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            shopifyId: '8050813173843',
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
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 5px 10px 10px rgb(0, 0, 0, 0.1);
    opacity: 0.8;
    transition: 0.5s;
    margin: "10px";
    padding: "10px";
    gap: 10px;
}


.image-container {
    overflow: hidden;
    align-self: center;
}

.image {
    object-fit: cover;
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