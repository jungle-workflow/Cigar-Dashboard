export type CigarItem = {
    brand: string,
    description: string,
    size: string,
    strength: string,
    price: number,
    restrictions: string,
}


export const getPrice = (item: CigarItem, userIP: string, selectedStores: string[]): string => {
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

export const searchItems = (items: CigarItem[], searchQuery: string): CigarItem[] => {
    // filter bottle list based on query match, runs more frequently
    const cleanQuery = `${searchQuery}`.toLowerCase()
    if (cleanQuery) {
        return items.filter((item) => {
            return (
                `${item.brand}`?.toLowerCase().includes(cleanQuery) ||
                ` ${item.description}`?.toLowerCase().includes(cleanQuery) ||
                ` ${item.size}`?.toLowerCase().includes(cleanQuery) ||
                ` ${item.strength}`?.toLowerCase().includes(cleanQuery) ||
                `${item.restrictions}`?.toLowerCase().includes(cleanQuery)
            );
        })
    } else {
        return items
    }
}

export const filterStore = (items: CigarItem[], selectedStores: string[]): CigarItem[] => {
    // filter seafood list based on query match, runs more frequently
    selectedStores;
    /* if (selectedStores.length > 0) {
        return seafoodItems.filter((item) => {
            return selectedStores.some((store) => {
                return (
                    store == 'fairfield'
                        ? item.fairfieldStatus == "In Stock"
                        : store == 'eastgate'
                            ? item.eastgateStatus == "In Stock"
                            : false
                );
            });
        });
    } */

    return items
}

export const filterCategory = (items: CigarItem[], selectedCategories: string[]): CigarItem[] => {
    // a more lightweight version that runs on an array of queries
    //console.log(additionalQueries);

    if (selectedCategories.length > 0) {
        return items.filter((item) => {
            return selectedCategories.some((query) => {
                return (
                    item.brand.toLowerCase().includes(query.toLowerCase())
                );
            });
        });
    } else {
        return items
    }
}

// TODO: create sort generic behavior
export const sortSeafood = (filteredSeafoodItems: CigarItem[], sortQuery: string, selectedStores: string[], IP: string): CigarItem[] => {

    // Sort the filtered array
    const cleanPrice = (price: string): number => {
        // Remove non-numeric characters except periods (.) using a regex
        const cleanedPrice = `${price}`.replace(/[^0-9.]/g, '');
        return cleanedPrice === "" ? 0.0 : parseFloat(cleanedPrice); // Convert cleaned string to a float
    };

    const getHardcodedCategory = (item: CigarItem): string => {
        return item.brand.includes("Out of Stock / Season")
            ? 'zzzzzzzzzzz'
            : item.brand.includes("Weekly Sale Items")
                ? 'aaaaaaaaaaa'
                : item.brand.includes("Whole Fish")
                    ? 'aaaaaaaaaab'
                    : item.brand
    }

    if (sortQuery === '') {
        return filteredSeafoodItems
    } else {
        let sortedSeafoodItems: CigarItem[] = filteredSeafoodItems
        switch (sortQuery) {
            case "category":
                {
                    filteredSeafoodItems.sort((a, b) => {
                        const aCat = getHardcodedCategory(a);
                        const bCat = getHardcodedCategory(b)

                        return aCat?.localeCompare(bCat);
                    })
                    break;
                }
            case "price ascending":
                {
                    filteredSeafoodItems.sort((a, b) => {
                        const aPrice = cleanPrice(getPrice(a, IP, selectedStores) ?? '99999999'); // Convert price to number
                        const bPrice = cleanPrice(getPrice(b, IP, selectedStores) ?? '99999999');

                        return aPrice - bPrice; // Ascending order by Price
                    })
                    break;
                }
            case "price descending":
                {
                    filteredSeafoodItems.sort((a, b) => {
                        const aPrice = cleanPrice(getPrice(a, IP, selectedStores) ?? '0'); // Convert price to number
                        const bPrice = cleanPrice(getPrice(b, IP, selectedStores) ?? '0');

                        return bPrice - aPrice; // Ascending order by Price
                    })
                    break;
                }
            case "alphabetically":
                {
                    filteredSeafoodItems.sort((a, b) => {
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