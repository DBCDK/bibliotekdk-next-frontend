import { useData } from "@/lib/api/api";
import { accessForManifestations } from "@/lib/api/access.fragments";
import { AccessEnum } from "@/lib/enums";
import { useMemo } from "react";
import useLoanerInfo from "./user/useLoanerInfo";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";

/**
 * Sorting entries of the access array
 *
 * Prioritize after how fast and easy it is to get the material,
 * online materials that are accessible on this site, are favored.
 */
function sortAccessArray(accessArr) {
  accessArr = accessArr.map((access) => {
    let priority = 0;
    if (access.__typename === AccessEnum.ACCESS_URL) {
      priority += 5000;
    }
    if (access.__typename === AccessEnum.INFOMEDIA_SERVICE) {
      priority += 4000;
    }
    if (access.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE) {
      priority += 3000;
    }
    if (access.__typename === AccessEnum.EREOL) {
      priority += 2000;
    }
    if (access.__typename === AccessEnum.INTER_LIBRARY_LOAN) {
      priority += 1000;
    }

    if (access.loginRequired) {
      priority -= 1;
    }

    // though zetland is an accessurl (+5000) we prioritize it lower than infomedia (+4000)
    if (access.origin === "www.zetland.dk") {
      priority -= 1001;
    }

    // articles from tidsskrift.dk should be BEFORE webarkiv
    if (access.origin === "tidsskrift.dk") {
      priority += 2;
    }

    if (access.origin === "DBC Webarkiv") {
      priority += 1;
    }

    if (access.url) {
      priority += 1;
    }

    if (access.origin === "Ereolen Go") {
      priority += 1;
    }

    if (access.origin === "Ereolen") {
      priority += 1;
    }

    if (access.issn) {
      priority += 1;
    }

    if (access.loanIsPossible) {
      priority += 1;
    }

    return { ...access, priority };
  });

  // Sort by priority score
  accessArr.sort((a, b) => b.priority - a.priority);

  return accessArr;
}

/**
 * Find unique access entries for all manifestations
 * and for every representation of the manifestation (same unit)
 */
function flattenAccess(manifestations) {
  // map of access keys -> access objects
  const accessMap = {};

  // Loop through all manifestations corresponding to the given pids
  manifestations?.forEach((m) => {
    // Loop through all representations of that manifestation
    // (manifestations in the same unit)
    m?.unit?.manifestations?.forEach((manifestionInUnit) => {
      // For this representation we loop through access
      manifestionInUnit?.access?.forEach((accessEntry) => {
        if (accessEntry?.loanIsPossible === false) {
          return;
        }

        // Create a key for this access entry to identify duplicates
        const keyArr = JSON.stringify(
          [
            accessEntry?.__typename,
            accessEntry?.url,
            accessEntry?.id,
            accessEntry?.issn,
          ]?.filter((part) => !!part)
        );

        // If this access is not seen before, we create it
        if (!accessMap[keyArr]) {
          accessMap[keyArr] = { ...accessEntry, pids: [] };

          // If infomedia, we generate URL based on id
          if (accessEntry?.id) {
            accessMap[keyArr].url = infomediaUrl(
              encodeTitleCreator(
                manifestionInUnit?.titles?.main?.[0],
                manifestionInUnit?.creators
              ),
              `work-of:${manifestionInUnit?.pid}`,
              accessEntry?.id
            );
          }
        }

        // Push this pid into the pids array in the access
        // then we have all the pids available with this access entry
        accessMap[keyArr].pids.push(manifestionInUnit.pid);
      });
    });
  });

  // Convert to array
  return Object.values(accessMap);
}
/**
 * Takes a list of manifestation pids, and returns
 * a list of objects of how they can be accessed
 */
export function useManifestationAccess({ pids, filter }) {
  const { loanerInfo, isLoading: loanerInfoIsLoading } = useLoanerInfo();
  // Fetch data for the pids needed to generate the access array
  const { data, isLoading: accessIsLoading } = useData(
    pids?.length > 0 && accessForManifestations({ pids })
  );

  // Generate the result only when data changes
  const res = useMemo(() => {
    if (accessIsLoading || loanerInfoIsLoading || !data) {
      return {};
    }

    const flattenedAccess = flattenAccess(data?.manifestations).filter(
      (entry) => {
        if (!filter) {
          return true;
        }
        return filter.includes(entry.__typename);
      }
    );

    // sort & filter - we only want access of type RESOURCE
    let access = sortAccessArray(flattenedAccess)?.filter(
      (singleAccess) =>
        singleAccess?.__typename !== AccessEnum.ACCESS_URL ||
        (singleAccess?.__typename === AccessEnum.ACCESS_URL &&
          singleAccess?.type === "RESOURCE")
    );

    const accessMap = {};
    access.forEach((entry) => (accessMap[entry.__typename] = entry));

    const userHasDigitalAccess = loanerInfo?.rights?.["digitalArticleService"];
    // we filter out digital access if user has no right
    if (!userHasDigitalAccess) {
      access = access?.filter(
        (acc) => acc.__typename !== AccessEnum.DIGITAL_ARTICLE_SERVICE
      );
    }
    // if there is both digital AND physical access AND user has digital access we filter out the physical
    if (
      accessMap?.[AccessEnum.DIGITAL_ARTICLE_SERVICE] &&
      accessMap?.[AccessEnum.INTER_LIBRARY_LOAN] &&
      userHasDigitalAccess
    ) {
      access = access?.filter(
        (acc) => acc.__typename !== AccessEnum.INTER_LIBRARY_LOAN
      );
    }

    let workTypesMap = {};
    data?.manifestations?.forEach((m) =>
      m?.workTypes?.forEach((workType) => (workTypesMap[workType] = true))
    );

    return {
      access,
      accessMap,
    };
  }, [data, loanerInfo]);

  const hasDigitalCopy = !!res?.accessMap?.[AccessEnum.DIGITAL_ARTICLE_SERVICE];
  const hasPhysicalCopy = !!res?.accessMap?.[AccessEnum.INTER_LIBRARY_LOAN];
  return {
    ...res,
    hasDigitalCopy,
    hasPhysicalCopy,
    digitalCopyPids:
      res?.accessMap?.[AccessEnum.DIGITAL_ARTICLE_SERVICE]?.pids || [],
    physicalCopyPids:
      res?.accessMap?.[AccessEnum.INTER_LIBRARY_LOAN]?.pids || [],
    supportsOrderFlow: hasDigitalCopy || hasPhysicalCopy,
    isLoading: loanerInfoIsLoading || accessIsLoading,
  };
}
