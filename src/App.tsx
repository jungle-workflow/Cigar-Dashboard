import { useEffect, useRef, useState } from 'react'
import './App.css'
import { fetchCigarData, searchItems, sortItems, CigarItem, setDevelopmentStyles, setWPStyles, filterStore, itemPropKeys } from './utils'
import { CigarCard } from './components/CigarCard/CigarCard'
import { FilterPanel, WithPopUp, WithSidePanel } from './components/FilterPanel/FilterPanel'
import { LoadingWidget } from './components/LoadingWidget'
import { STORES } from './utils'
import { ScrollPopup } from './components/ScrollPopup/ScrollPopup'

const notFoundIcons = [
  `( ╥﹏╥) ノシ`,
  `( ˘ ³˘)ノ°ﾟº❍｡`,
  `(╯°□°)╯`,
  `(╯’□’)╯︵ ┻━┻`,
]

function App() {
  const [appLoading, setAppLoading] = useState<boolean>(true)
  const [items, setItems] = useState<CigarItem[]>([])
  const [filteredItems, setFilteredItems] = useState<CigarItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [strengths, setStrengths] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortQuery, setSortQuery] = useState<string>('')
  const [selectedStore, setSelectedStores] = useState<string[]>([])
  // const [userIP, setUserIP] = useState<string>('')
  const [selectedFiltersBrand, setSelectedFiltersBrand] = useState<string[]>([])
  const [selectedFiltersSize, setSelectedFiltersSize] = useState<string[]>([])
  const [selectedFiltersStrength, setSelectedFiltersStrength] = useState<string[]>([])
  const [viewportRes, setViewportRes] = useState({ x: window.innerWidth, y: window.innerHeight })
  const [isMobile, setIsMobile] = useState(viewportRes.x < 650)
  const [jcfDestroyed, setJcfDestroyed] = useState<boolean>(false)
  const [navHeight, setNavHeight] = useState<number>(50)
  const sortRef = useRef<HTMLSelectElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {  //execute the initial fetches
    console.log("v .5");


    import.meta.env.PROD ? undefined : setDevelopmentStyles()
    setTimeout(setWPStyles, 500);

    // get user IP
    /* fetch('https://api64.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setUserIP(data.ip))
      .catch(error => console.error('Error fetching IP:', error)); */

    const fetchData = async () => {
      try {
        //console.log("Fetching data");
        const data = await fetchCigarData();
        setItems(data);
        setFilteredItems(filterStore(sortItems((data), 'category', /* selectedStore, */ /* userIP */), selectedStore))
      } catch {
        //console.log("Error fetching data in useEffect");
      }
    };

    fetchData();
  }, [])


  useEffect(() => { // JCF Setting up the window.onload event inside useEffect
    /* UNBIND JCF FROM SELECT OBJECTS */
    let numRecursions = 0;
    const peskyJCF = () => {
      if (!jcfDestroyed && numRecursions < 10) {
        numRecursions++

        try {
          //console.log("Getting JCF Instance");

          const selectElements = document.querySelectorAll('select');
          //console.log("select object: ", selectElement);

          // Get the jcf instance associated with the select element

          selectElements.forEach((selectElement) => {
            // @ts-ignore
            const jcfInstance = jcf.getInstance(selectElement);

            // Check if instance exists and destroy it
            if (jcfInstance) {
              jcfInstance.destroy();
              console.log("Destroying JCF Instance D:<", jcfInstance);
              setJcfDestroyed(true)
            } else {
              //console.log("NO INSTANCE AHHHH");
              setTimeout(peskyJCF, 500)
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    }

    window.addEventListener('load', peskyJCF);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('load', peskyJCF);
    };
  }, []);

  useEffect(() => { // assemble list of categories and set app loading status
    // map to get an array of categories 
    const categories = items
      .map(item => item.brand.trim())
      .filter(category => category); // Filter out empty or whitespace-only item
    const uniqueCategories = Array.from(new Set(categories));
    setCategories(uniqueCategories)

    const sizes = items
      .map(item => item.size.trim())
      .filter(size => size); // Filter out empty or whitespace-only item
    const uniqueSizes = Array.from(new Set(sizes));
    setSizes(uniqueSizes)

    const strengths = items
      .map(item => item.strength.trim())
      .filter(strength => strength); // Filter out empty or whitespace-only item
    const uniqueStrengths = Array.from(new Set(strengths));
    setStrengths(uniqueStrengths)

    if (appLoading && (items.length > 0)) {
      setAppLoading(false)
    }

    /* AUTO GENERATED MATCHING SEAFOOD TYPES */
    //setTypes(assembleSeafoodTypes(seafoodItems, seafoodTypes))
  }, [items])

  useEffect(() => {  // when the user searches for a keyword, filter it here
    setFilteredItems([...orderedItems()])
  }, [searchQuery, selectedStore, selectedFiltersBrand, selectedFiltersSize, selectedFiltersStrength, sortQuery])

  useEffect(() => { // window size listener
    const handleResize = () => {
      setViewportRes({ x: window.innerWidth, y: window.innerHeight })
      setIsMobile(window.innerWidth < 650)
      setNavHeight(document.getElementById('nav')?.offsetHeight ?? 50)
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize); // Check on resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup
    };
  }, [window.innerWidth, window.innerHeight, items]);

  const orderedItems = (): CigarItem[] => {
    return sortItems(
      searchItems(
        searchItems(
          searchItems(
            searchItems(
              filterStore(items, selectedStore),
              [searchQuery], [itemPropKeys.brand, itemPropKeys.description, itemPropKeys.size, itemPropKeys.strength]
            ), selectedFiltersBrand, [itemPropKeys.brand]
          ), selectedFiltersSize, [itemPropKeys.size]
        ), selectedFiltersStrength, [itemPropKeys.strength]
      ),
      sortQuery, /* selectedStore, userIP */
    )
  }

  const onSort = () => {
    const currentVal = sortRef.current?.value ?? ''
    setSortQuery(currentVal)
  }

  const handleFilterBrand = (query: string) => { // handle toggle list of filters from the filter panel
    setSelectedFiltersBrand([...toggle(selectedFiltersBrand, query)])
  }
  const handleFilterSize = (query: string) => { // handle toggle list of filters from the filter panel
    setSelectedFiltersSize([...toggle(selectedFiltersSize, query)])
  }
  const handleFilterStrength = (query: string) => { // handle toggle list of filters from the filter panel
    setSelectedFiltersStrength([...toggle(selectedFiltersStrength, query)])
  }

  const handleFilterStore = (query: string) => { // handle store preference
    setSelectedStores([...toggle(selectedStore, query)])
  }

  const toggle = (array: any[], query: any) => {
    // toggle item from array
    let newArray = array;
    if (newArray.includes(query)) {
      newArray = newArray.filter((item) => item != query)
    } else {
      newArray.push(query)
    }
    return newArray
  }

  return (
    <>
      <ScrollPopup />
      <div id="appContainer" ref={appContainerRef}>

        <div style={{
          position: "relative",
          /* transform: `${isMobile ? 'none' : 'translateY(8px)'}` */
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            position: `${isMobile ? 'relative' : 'absolute'}`,
            width: `${isMobile ? '90svw' : '60svw'}`,
            marginBottom: '8px'
          }}>
            <h1 style={{
              textAlign: 'left',
              color: '#e9e5d4',
              margin: 0,
            }}>
              Cigar Deals
            </h1>

            {/* Select Store */}
            <div id="chooseStoreContainer">
              <button id="storeFairfield" className={`chooseStore noAppearance ${selectedStore.includes(STORES.FF) ? 'active' : ''}`}
                onClick={() => {
                  handleFilterStore(STORES.FF)
                }}>
                {STORES.FF.toUpperCase()}
              </button>
              <button id="storeEastgate" className={`chooseStore noAppearance ${selectedStore.includes(STORES.EG) ? 'active' : ''}`}
                onClick={() => {
                  handleFilterStore(STORES.EG)
                }}>
                {STORES.EG.toUpperCase()}
              </button>
            </div>
            {/* <p style={{textAlign: "left", padding: "2px 5px", color: "#e9e5d4"}}>All items are subject to availability</p> */}



          </div>
        </div>

        <div id='toolbarWrapper' style={{ top: `${navHeight + 10}px` }}>
          <div className='filterToolbar'>

            {/* Sort Button */}
            <div style={{ position: 'relative' }}>
              <select id="sortWidget" className="noAppearance" ref={sortRef} onChange={onSort}
                style={{ textAlign: "left", zIndex: 1, width: '77px', }}>
                <option value={'category'}>Sort</option>
                <option value={'category'}>Category</option>
                <option value={'price descending'}>Most $</option>
                <option value={'price ascending'}>Least $</option>
                <option value={'alphabetically'}>A-Z</option>
              </select>
              <span className="material-symbols-outlined selectChevron" style={{
                position: 'absolute',
                right: '3px',
                zIndex: 0,
              }}>keyboard_arrow_down</span>
            </div>

            {/* Search Bar */}
            <div className='inputWrapper' style={{ flexGrow: `${isMobile ? 1 : 0}` }}>
              <input type="text"
                placeholder="Search..."
                value={searchQuery ?? undefined}
                onChange={(e) => setSearchQuery(e.target.value)} />
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>

          {
            isMobile ?
              <div className='filterToolbar'>
                <WithPopUp viewportRes={viewportRes} title='Brand' scrollable={true}>
                  <FilterPanel filters={categories} activeFilters={selectedFiltersBrand} handleFilter={handleFilterBrand} />
                </WithPopUp>
                <WithPopUp viewportRes={viewportRes} title='Size' scrollable={true}>
                  <FilterPanel filters={sizes} activeFilters={selectedFiltersSize} handleFilter={handleFilterSize} />
                </WithPopUp>
                <WithPopUp viewportRes={viewportRes} title='Strength' scrollable={true}>
                  <FilterPanel filters={strengths} activeFilters={selectedFiltersStrength} handleFilter={handleFilterStrength} />
                </WithPopUp>

              </div> : undefined
          }
        </div>

        <p style={{
          color: "#e9e5d4", fontWeight: 500, fontStyle: 'italic', width: '100%', textAlign: 'right', paddingRight: '6px', margin: 0,
          marginBottom: `${!isMobile ? "30px" : 0}`
        }}>
          {filteredItems.length} Results
          {selectedFiltersBrand.length > 0 && ` >`}
          {selectedFiltersBrand.map((filter, index) => {
            return <span key={index}>{` ${filter}${index == selectedFiltersBrand.length - 1 ? `` : `,`}`}</span>
          })}
          <br />
          All items are subject to availability.
        </p>

        {/* <div style={{ position: 'relative', overflow: 'visible', height: '30px', width: '50px', margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <div className='scrollAnim' style={{
            position: 'absolute', width: '100vw', outline: 'red solid 2px', color: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'nowrap'
          }}>
            {Array(5).fill(null).map((_, i) => (
              <p key={i}>10% OFF 20 CIGARS</p>
            ))}
          </div>
        </div> */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          outline: 'red solid 2px',
          background: 'red',
          color: 'beige'
        }}>
          <div className="scrollAnim" style={{
            display: 'flex',
            width: 'max-content',   // sized to actual content, not viewport
            gap: '20px'
          }}>
            {/* first copy */}
            {Array(5).fill(null).map((_, i) => (
              <p key={`a-${i}`} style={{ whiteSpace: 'nowrap', margin: 0 }}>
                10% OFF 20 CIGARS
              </p>
            ))}
            {/* duplicate copy — required for seamless loop */}
            {Array(5).fill(null).map((_, i) => (
              <p key={`b-${i}`} style={{ whiteSpace: 'nowrap', margin: 0 }}>
                10% OFF 20 CIGARS
              </p>
            ))}
          </div>
        </div>
        {
          appLoading ? <LoadingWidget /> :
            <div id="listWrapper">
              {
                !isMobile ?
                  <div id="filterWrapper" style={{ top: `${navHeight + 10}px` }}>
                    <WithSidePanel viewportRes={viewportRes} scrollable={true}>
                      <FilterPanel filters={categories} activeFilters={selectedFiltersBrand} handleFilter={handleFilterBrand} />
                    </WithSidePanel>
                    <WithSidePanel viewportRes={viewportRes} scrollable={true}>
                      <FilterPanel filters={sizes} activeFilters={selectedFiltersSize} handleFilter={handleFilterSize} />
                    </WithSidePanel>
                    <WithSidePanel viewportRes={viewportRes} scrollable={true}>
                      <FilterPanel filters={strengths} activeFilters={selectedFiltersStrength} handleFilter={handleFilterStrength} />
                    </WithSidePanel>
                  </div> : undefined
              }
              <div id="seafoodList">
                {filteredItems.length > 0 ? filteredItems.map((item, index) => {
                  return <CigarCard key={index} item={item} /* selectedStores={selectedStore} */ /* IP={userIP} */></CigarCard>
                }) : <div style={{ flexDirection: 'column' }} className='wineBottle'><p>None of our seafood matches your search!</p><p>{notFoundIcons[Math.floor(Math.random() * 4)]}</p></div>}
              </div>
            </div>
        }
      </div >
    </>
  )
}

export default App