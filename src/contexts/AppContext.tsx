import { PanelType } from "~/constants/app-options";
import React, { createContext, useState } from "react";

type Template = any;
interface IAppContext {
    dimensions: any;
    setDimensions: (dimensions: any) => void;
    backgroundColor: any;
    setBackgroundColor: (color: any) => void;
    fonts: any[];
    setFonts: (fonts: any[]) => void;
    isSaving: boolean | undefined;
    setIsSaving: (isSaving: boolean) => void; 
    isShowMobileModal: boolean
    setIsShowMobileModal: (isShowMobileModal: boolean) => void;
    isMobile: boolean | undefined;
    setIsMobile: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    backgroundRemove: boolean | undefined;
    setBackgroundRemove: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    templates: Template[];
    setTemplates: (templates: Template[]) => void;
    uploads: any[];
    setUploads: (templates: any[]) => void;
    shapes: any[];
    setShapes: (templates: any[]) => void;
    activePanel: PanelType;
    setActivePanel: (option: PanelType) => void;
    activeSubMenu: string | null;
    setActiveSubMenu: (option: string) => void;
    currentTemplate: any;
    setCurrentTemplate: any;
    isAssetLoading: boolean;
    setIsAssetLoading: (isAssetLoading: boolean) => void;
    ignoreAppOptions: any[];
    setIgnoreAppOptions: (ignoreAppOptions: any[]) => void;
    stickerParams: any;
    setStickerParams: (stickerParams: any) => void;
    params: any;
    setParams: (params: any) => void;
    referral_template_id: any;
    setReferralTemplateId: (referral_template_id: any) => void;
}

export const AppContext = createContext<IAppContext>({
    backgroundColor: 'fff',
    setBackgroundColor: () => {},
    dimensions: { width: 1000, height: 1000 },
    isSaving: false,
    setIsSaving: () => {},
    isShowMobileModal: false,
    setIsShowMobileModal: () => {},
    setDimensions: () => {},
    fonts: [],
    setFonts: () => {},
    isMobile: false,
    setIsMobile: () => {},
    backgroundRemove: false,
    setBackgroundRemove: () => {},
    templates: [],
    setTemplates: () => {},
    uploads: [],
    setUploads: () => {},
    shapes: [],
    setShapes: () => {},
    activePanel: PanelType.TEMPLATES,
    setActivePanel: () => {},
    activeSubMenu: null,
    setActiveSubMenu: (value: string) => {},
    currentTemplate: {},
    setCurrentTemplate: {},
    isAssetLoading: false,
    setIsAssetLoading: () => {},
    ignoreAppOptions: [],
    setIgnoreAppOptions: () => {},
    stickerParams: {},
    setStickerParams: () => {},
    params: {},
    setParams: () => {},
    referral_template_id: "",
    setReferralTemplateId: () => {}
});

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
    const [backgroundRemove, setBackgroundRemove] = useState(false);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [uploads, setUploads] = useState<any[]>([]);
    const [shapes, setShapes] = useState<Template[]>([]);
    const [activePanel, setActivePanel] = useState<PanelType>(PanelType.TEMPLATES);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("fff");
    const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 })
    const [fonts, setFonts] = useState([])
    const [isSaving, setIsSaving] = useState(false)
    const [isShowMobileModal, setIsShowMobileModal] = useState(false)
    const [isAssetLoading, setIsAssetLoading] = useState(false)
    const [ignoreAppOptions, setIgnoreAppOptions] = useState([])
    const [stickerParams, setStickerParams] = useState({})
    const [params, setParams] = useState({})
    const [referral_template_id, setReferralTemplateId] = useState("")

    const context = {
        isMobile,
        setIsMobile,
        backgroundRemove,
        setBackgroundRemove,
        dimensions,
        setDimensions,
        fonts,
        setFonts,
        isSaving,
        setIsSaving,
        templates,
        setTemplates,
        activePanel,
        setActivePanel,
        shapes,
        setShapes,
        activeSubMenu,
        setActiveSubMenu,
        uploads,
        setUploads,
        currentTemplate,
        setCurrentTemplate,
        backgroundColor,
        setBackgroundColor,
        isShowMobileModal,
        setIsShowMobileModal,
        isAssetLoading,
        setIsAssetLoading,
        ignoreAppOptions,
        setIgnoreAppOptions,
        stickerParams,
        setStickerParams,
        params,
        setParams,
        referral_template_id,
        setReferralTemplateId
    };
    
    return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
