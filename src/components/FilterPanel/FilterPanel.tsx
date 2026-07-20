import { ReactNode, useEffect, useRef, useState } from "react"
import './FilterPanel.css'
import { nanoid } from "nanoid"
import { FilterType } from "../../utils"

interface FilterProps {
    filters: string[]
    activeFilters: string[]
    type: FilterType
    handleFilter: (type: FilterType, query: string) => void
}

export function FilterPanel({ filters, activeFilters, type, handleFilter }: FilterProps) {
    // a relocatable, resizable filter display
    return <>{filters.map((filter, index) => {
        return <FilterInput filter={filter} activeFilters={activeFilters} type={type} key={`${filter}-${index}`} handleFilter={handleFilter} />
    })}</>
}


interface InputProps {
    filter: string
    activeFilters: string[]
    type: FilterType
    handleFilter: (type: FilterType, query: string) => void
}
export function FilterInput({ filter, activeFilters, type, handleFilter }: InputProps) {
    const [checked, setChecked] = useState<boolean>(false)
    const id = useRef<string>(nanoid())
    useEffect(() => {
        activeFilters?.includes(filter) ? setChecked(true) : setChecked(false)
    }, [])

    return <>
        <div className="filterInput" style={{ gap: '4px', padding: 0, height: 'min-content' }} key={`${filter}-${id}`}>
            <input type='checkbox' checked={checked} value={filter} onChange={() => { handleFilter(type, filter); setChecked(!checked) }} />
            <p onClick={() => { handleFilter(type, filter); setChecked(!checked) }} style={{ margin: 0 }}>{filter}</p>
        </div>
    </>
}


interface PanelProps {
    children: ReactNode
    viewportRes: { x: number, y: number }
    scrollable: boolean
    title?: string
}

export const WithSidePanel = ({ children, viewportRes, scrollable }: PanelProps) => {
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false)

    const filterRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        scrollable && filterRef?.current ? setIsOverflowing(filterRef.current.scrollHeight > filterRef.current.clientHeight) : undefined
    }, [viewportRes])

    return <div ref={filterRef} key={nanoid()} style={{ overflowY: `${isOverflowing ? `scroll` : `hidden`}` }} className="filterPanel">{children}</div>
}

interface FilterButtonProps {
    title: string
    type: FilterType
    toggleVisible: (query: FilterType) => void
}
export const FilterButton = ({ title, type, toggleVisible }: FilterButtonProps) => {
    return <>
        <div className="filterPanel" key={`${title}-panel`} style={{ position: 'relative' }} onClick={() => toggleVisible(type)}>
            <span style={{ fontSize: '20px', fontVariationSettings: `'FILL' 1` }} className="material-symbols-outlined">bolt</span>
            <p style={{ fontWeight: 600, textWrap: "nowrap", padding: '5px', margin: 0 }}>{title}</p>
        </div>
    </>
}


interface PopupProps {
    visible: boolean
    title: string | undefined
    type: FilterType
    filterRef?: React.MutableRefObject<HTMLDivElement | null>
    children: ReactNode
    toggleVisible: (query: FilterType) => void
}
export const PopupPanel = ({ visible, title, type, children, toggleVisible }: PopupProps) => {
    /* useEffect(() => {
       // Attach the event listener to detect outside clicks
       document.addEventListener('mousedown', handleClickOutside);

       // Cleanup on unmount
       return () => {
           document.removeEventListener('mousedown', handleClickOutside);
       };
   }, []); */
    return <>
        {visible
            ? <div /* ref={filterRef} */ className="modal" style={{
                opacity: `${visible ? 1 : 0}`,
                pointerEvents: `${visible ? 'all' : 'none'}`,
            }}
                tabIndex={0}
                onClick={(e) => {
                    if (e.target === e.currentTarget)
                        toggleVisible(type)
                }}>
                <div className="modalContent">
                    <div className="title">
                        <h4>{title}</h4>
                        <button onClick={() => toggleVisible(type)}>x</button>
                    </div>
                    <div className="children">
                        {children}
                    </div>
                </div>
            </div>
            : undefined}</>
}