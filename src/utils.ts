export type CigarItem = {
    brand: string,
    description: string,
    size: string,
    strength: string,
    price: number,
    restrictions: string,
}
export const itemPropKeys = {
    brand: "brand",
    description: "description",
    size: "size",
    strength: "strength",
    price: "price",
    restrictions: "restrictions",
}
export const RESTRICTIONS = {
    none: '',
    ffOnly: 'Fairfield Only',
    egOnly: 'Eastgate Only'
}

export const STORES = {
    FF: "fairfield",
    EG: "eastgate"
}


export const getPrice = (item: CigarItem, userIP: string, selectedStores: string[]): string => { // this method exists to display a different price if they vary between stores
    return `${item.price}`
}

const endpoints = {
    proxy: 'api/cigar-deals.json',
    online: 'https://mobile-api-dev.junglejims.com/cigar-deals.json',
}

export const fetchCigarData = async (): Promise<CigarItem[]> => {
    try {
        const response = await fetch(import.meta.env.PROD ? endpoints.online : endpoints.proxy);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const cigarData = await response.json();
        console.log(cigarData);
        return cigarData.cigarDeals as CigarItem[]
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Ensure the error is propagated if necessary
    }
}

export const searchItems = (items: CigarItem[], searchQuery: string, filters: string[]): CigarItem[] => {
    // filter bottle list based on query match
    const cleanQuery = `${searchQuery}`.toLowerCase()
    if (cleanQuery) {
        return items.filter((item) => {
            for (const filter of filters) {
                // @ts-ignore
                if (item[`${filter}`]?.toLowerCase().includes(cleanQuery)) {
                    return true
                }
            }
        })
    } else {
        return items
    }
}

export const filterStore = (items: CigarItem[], selectedStores: string[]): CigarItem[] => {
    console.log("filtering store", selectedStores)
    // combos fairfield = restrictions.none and restrictions.ffonly
    // combos eastgate = restrictions.none and restrictions.egonly
    // combos none = restrictions.none and restrictions.ffonly and restrictions.egonly
    // combos both = restrictions.none and restrictions.ffonly and restrictions.egonly

    if ((selectedStores.includes(STORES.FF) && selectedStores.includes(STORES.EG)) || (selectedStores.length == 0 || selectedStores.includes(""))) {
        console.log("1")
        return items.filter((item) =>
            item.restrictions == undefined ||
            item.restrictions == RESTRICTIONS.none ||
            item.restrictions == RESTRICTIONS.ffOnly ||
            item.restrictions == RESTRICTIONS.egOnly
        )
    } else if (selectedStores.includes(STORES.FF)) {
        console.log("2")
        return items.filter((item) =>
            item.restrictions == undefined ||
            item.restrictions == RESTRICTIONS.none ||
            item.restrictions == RESTRICTIONS.ffOnly
        )
    } else if (selectedStores.includes(STORES.EG)) {
        console.log("3")
        return items.filter((item) =>
            item.restrictions == undefined ||
            item.restrictions == RESTRICTIONS.none ||
            item.restrictions == RESTRICTIONS.egOnly
        )
    } else {
        return items
    }
}


// TODO: create sort generic behavior
export const sortItems = (filteredItems: CigarItem[], sortQuery: string, selectedStores: string[], IP: string): CigarItem[] => {

    // Sort the filtered array
    const cleanPrice = (price: string): number => {
        // Remove non-numeric characters except periods (.) using a regex
        const cleanedPrice = `${price}`.replace(/[^0-9.]/g, '');
        return cleanedPrice === "" ? 0.0 : parseFloat(cleanedPrice); // Convert cleaned string to a float
    };

    /* const getHardcodedCategory = (item: CigarItem): string => { // if you want to brute force a category order you can modify this utility
        return item.brand.includes("Out of Stock / Season")
            ? 'zzzzzzzzzzz' // place category last always
            : item.brand.includes("Weekly Sale Items")
                ? 'aaaaaaaaaaa' // place category first always
                : item.brand.includes("Whole Fish")
                    ? 'aaaaaaaaaab' // place category second always
                    : item.brand
    } */

    if (sortQuery === '') {
        return filteredItems
    } else {
        let sortedSeafoodItems: CigarItem[] = filteredItems
        switch (sortQuery) {
            case "category":
                {
                    filteredItems.sort((a, b) => {
                        return a.brand?.localeCompare(b.brand);
                    })
                    break;
                }
            case "price ascending":
                {
                    filteredItems.sort((a, b) => {
                        const aPrice = cleanPrice(getPrice(a, IP, selectedStores) ?? '99999999'); // Convert price to number
                        const bPrice = cleanPrice(getPrice(b, IP, selectedStores) ?? '99999999');

                        return aPrice - bPrice; // Ascending order by Price
                    })
                    break;
                }
            case "price descending":
                {
                    filteredItems.sort((a, b) => {
                        const aPrice = cleanPrice(getPrice(a, IP, selectedStores) ?? '0'); // Convert price to number
                        const bPrice = cleanPrice(getPrice(b, IP, selectedStores) ?? '0');

                        return bPrice - aPrice; // Ascending order by Price
                    })
                    break;
                }
            case "alphabetically":
                {
                    filteredItems.sort((a, b) => {
                        return a.description?.localeCompare(b.description);
                    })
                    break;
                }


        }


        return sortedSeafoodItems
    }
}

export const setDevelopmentStyles = () => {
    console.log('setting dev styles');

    const DevelopmentStyles = [
        '<link rel="stylesheet" href="../../Default CSS/907ce8a0_ai1ec_parsed_css.css">',
        '<link rel="stylesheet" href="../../Default CSS/ajax-load-more.min.css">',
        '<link rel="stylesheet" href="../../Default CSS/all.css">',
        '<link rel="stylesheet" href="../../Default CSS/bootstrap.min.css">',
        '<link rel="stylesheet" href="../../Default CSS/calendar.css">',
        '<link rel="stylesheet" href="../../Default CSS/czo1ptk.css">',
        '<link rel="stylesheet" href="../../Default CSS/item-search-frontend.css">',
        '<link rel="stylesheet" href="../../Default CSS/jquery.fancybox.css">',
        '<link rel="stylesheet" href="../../Default CSS/jquery.fancybox.min.css">',
        '<link rel="stylesheet" href="../../Default CSS/js_composer.min.css">',
        '<link rel="stylesheet" href="../../Default CSS/perfect-columns.css">',
        '<link rel="stylesheet" href="../../Default CSS/print.min.css">',
        '<link rel="stylesheet" href="../../Default CSS/style-wp.css">',
        '<link rel="stylesheet" href="../../Default CSS/style.css">',
        '<link rel="stylesheet" href="../../Default CSS/style2.css">',
        '<link rel="stylesheet" href="../../Default CSS/styles__ltr.css">',
        '<link rel="stylesheet" href="../../Default CSS/styles.css">',
        '<link rel="stylesheet" href="../../Default CSS/v4-shims.css">',
    ]
    DevelopmentStyles.forEach(style => {
        const template = document.createElement('template');
        template.innerHTML = style.trim(); // Avoid whitespace issues
        document.head.appendChild(template.content);
    });
}

export const setWPStyles = () => {

    // get scrollbar width
    const scrollbarWidth = document.documentElement.clientWidth - window.innerWidth

    // brute force the correct widths and overflow properties
    const wrapper: HTMLDivElement | null = document.getElementById('wrapper') as HTMLDivElement
    const root: HTMLDivElement | null = document.getElementById("root") as HTMLDivElement
    const btn: HTMLLinkElement | null = document.querySelector("#header > div > div.header-holder > div.sub-nav > a")
    const header: HTMLLinkElement | null = document.querySelector("#header")

    const wrapperStyle = {
        overflow: 'visible',
        width: `calc(100svw + ${scrollbarWidth}px)`
    }
    const rootStyle = {
        width: `calc(100svw + ${scrollbarWidth}px)`
    }

    const btnStyle = {
        width: 'auto',
        whiteSpace: 'normal', // Equivalent to text wrapping
        overflow: 'visible'
    };

    const navStyle = {
        position: 'relative',
        zIndex: 101,
    };

    // Apply each style from the object to the element
    wrapper && Object.assign(wrapper.style, wrapperStyle);
    root && Object.assign(root.style, rootStyle);
    btn && Object.assign(btn.style, btnStyle);
    header && Object.assign(header.style, navStyle);

}