import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createSiteContentDraft,
  defaultSiteContent,
  mergeSiteContent,
} from '../content/defaultSiteContent';
import { siteContentService } from '../services/siteContentService';

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(() =>
    createSiteContentDraft(defaultSiteContent),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const refreshSiteContent = useCallback(async () => {
    const storedContent = await siteContentService.getSiteContent();
    const mergedContent = mergeSiteContent(defaultSiteContent, storedContent);
    setSiteContent(createSiteContentDraft(mergedContent));
    return mergedContent;
  }, []);

  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        await refreshSiteContent();
      } catch (error) {
        setSiteContent(createSiteContentDraft(defaultSiteContent));
      } finally {
        setIsLoading(false);
      }
    };

    loadSiteContent();
  }, [refreshSiteContent]);

  const saveSiteContent = useCallback(async (nextContent) => {
    setIsSaving(true);

    try {
      const savedContent = await siteContentService.saveSiteContent(nextContent);
      const mergedContent = mergeSiteContent(defaultSiteContent, savedContent);
      setSiteContent(createSiteContentDraft(mergedContent));
      return mergedContent;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      siteContent,
      isLoading,
      isSaving,
      saveSiteContent,
      refreshSiteContent,
    }),
    [isLoading, isSaving, refreshSiteContent, saveSiteContent, siteContent],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used inside SiteContentProvider.');
  }

  return context;
};
