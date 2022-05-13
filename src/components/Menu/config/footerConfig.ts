import { FooterLinkType } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
    {
        label:"Products",
        items:[
            {
                label:"Helix",
                href:"#"
            },
            {
                label:"2nd Platform",
                href:"#"
            },
            {
                label:"Nexus",
                href:"#"
            },
            {
                label:"Roadmap",
                href:"#"
            }
        ]
    },
    {
        label:"Learn",
        items:[
            {
                label:"Docs",
                href:"#"
            },
            {
                label:"Medium",
                href:"#"
            },
            {
                label:"Github",
                href:"#"
            },
            {
                label:"SLP Whitepaper",
                href:"#"
            }
        ]
    },
    {
        label:"Community",
        items:[
            {
                label:"Discord",
                href:"#"                
            },
            {
                label:"Governance",
                href:"#"
            },
            {
                label:"Geometry Twitter",
                href:"#"
            },
            {
                label:"Helix Twitter",
                href:"#"
            }
        ]
    },
    {
        label:"Contact",
        items:[
            {
                label:"Email us: hi@geometry.fi",
                href:"#"
            },
            {
                label:"Support Tickets",
                href:"#"
            },
            {
                label:"Create Ticket",
                href:"#"
            }            
        ]
    },
    {
        label:"Legal",
        items:[
            {
                label:"Privacy policy",
                href:"#"
            },
            {
                label:"Terms & conditions",
                href:"#"
            }            
        ]
    }
]
