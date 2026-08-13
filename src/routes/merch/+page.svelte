<script>
    /** @type {import('./$types').PageData} */
    import PageHeader from "$lib/components/PageHeader.svelte";
    import PanelBox from "$lib/components/PanelBox.svelte"

    const products = [
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
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
    {#each products as product}
        <PanelBox borderRadius="12px" style="display: flex; flex-direction: column; opacity: 1;">
            <h2 class="title">{product.title}</h2>
            <div class="image-container">
                <img class="image" src={product.image} alt={product.alt} loading="lazy"/> <!--product image-->
            </div>
            <div class="size-container">
                {#each product.sizes as size}
                    <button class="size-button">{size}</button>
                {/each}
            <p class="size-quantity">999</p> <!--product quantity-->
            </div>
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

.size-container {
    display: flex;
    margin-top: 15px;
}

.size-button {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    margin-right: .5rem;
}

.size-button:hover {
    cursor: pointer;
    border-color: #333;
}

.size-quantity {
    margin-left: auto;
    font-size: 1.2rem;
    color: #333;
}

.size-quantity::after {
    content: " left";
}
</style>