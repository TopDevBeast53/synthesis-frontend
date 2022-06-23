import { FooterLinkType } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
    {
        label:"Helix",
        items:[
            {
                label:"Trade Crypto",
                href:"/swap"
            },
            {
                label:"Trade LP Tokens",
                href:"/lps-swap"
            },
            {
                label:"Trade Yield",
                href:"/yield-swap"
            },
            {
                label:"Add Liquidity",
                href:"/liquidity"
            }
        ]
    },
    {
        label:"Earn",
        items:[
            {
                label:"Helix Farms",
                href:"/farms"
            },
            {
                label:"Helix Pools",
                href:"/pools"
            },
            {
                label:"Helix Vaults",
                href:"/vaults"
            },
            {
                label:"Geobot Staking",
                href:"/geobot-staking"
            }
        ]
    },
    {
        label:"Community",
        items:[
            {
                label:"Discord",
                href:"https://discord.gg/geometry"                
            },
            {
                label:"Governance",
                href:"/voting"
            },
            {
                label:"Helix Twitter",
                href:"https://twitter.com/helixgeometry"
            },
            {
                label:"Geometry Twitter",
                href:"https://twitter.com/geometryfinance"
            }
        ]
    },
    {
        label:"Geometry",
        items:[
            {
                label:"Geometry.fi",
                href:"https://geometry.fi"
            },
            {
                label:"Medium",
                href:"https://medium.com/geometryfinance"
            },
            {
                label:"SLP Whitepaper",
                href:"https://geometry.fi/whitepaper"
            },
            {
                label:"Support Tickets",
                href:"https://discord.gg/QtKhZbZJZU"
            }        
        ]
    },
    {
        label:"Info",
        items:[
            {
                label:"Github",
                href:"https://github.com/helixgeometry"
            },
            {
                label:"Documentation",
                href:"https://geometry.gitbook.io/helix"
            }            
        ]
    }
]
