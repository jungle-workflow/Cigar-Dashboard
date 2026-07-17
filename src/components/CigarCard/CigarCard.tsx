import { getPrice, CigarItem } from "../../utils"
import './CigarCard.css'

interface cardProps {
    item: CigarItem
    /* selectedStores: string[]
    IP: string */
}

export function CigarCard({ item, /* selectedStores, IP */ }: cardProps) {
    return <>
        <div className="Item">
            <div>
                <h2 style={{ fontSize: '28px', margin: '0px', lineHeight: 1, textTransform: 'capitalize' }}>
                    {item.description.toLowerCase()}
                </h2>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '12px',
                    rowGap: '2px',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap'
                }}>

                    <p style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        margin: '0px',
                    }}>{item.brand}</p>

                    <p style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        margin: '0px',
                    }}>{item.restrictions}</p>
                    
                    <p style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        margin: '0px',
                    }}>{item.size}</p>
                    <p style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        margin: '0px',
                    }}>{item.strength}</p>
                </div>
            </div>
            <div>
                <h3 style={{
                    fontWeight: 900, textTransform: "lowercase",
                    fontSize: `${getPrice(item, /* IP, selectedStores */) == "Out of Stock" ? '22px' : ''}`
                }}>{`$${Number(getPrice(item, /* IP, selectedStores */)).toFixed(2)}`}</h3>
            </div>
        </div>
    </>
}