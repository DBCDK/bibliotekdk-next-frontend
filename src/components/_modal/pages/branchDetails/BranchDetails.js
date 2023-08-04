import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import uniq from "lodash/uniq";
import Text from "@/components/base/text/Text";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "css/animations";
import { templateForBranchDetails } from "@/components/base/materialcard/templates/templates";
import styles from "./BranchDetails.module.css";
import cx from "classnames";
import ReservationButton from "@/components/work/reservationbutton";

function mergeAgencyHoldingsAndPickupAgency() {
  const agencyHoldings = {
    responderDetailed: [
      {
        pid: "870970-basis:23540703",
        responderId: "726500",
        holdingsItem: [
          {
            localItemId: "23540703",
            policy: 0,
          },
        ],
      },
    ],
    error: [],
    trackingId: "uuid",
  }.responderDetailed;

  const pickupAgencyList = {
    library: [
      {
        agencyId: "726500",
        agencyType: "Folkebibliotek",
        agencyName: "Roskilde Bibliotekerne",
        agencyPhone: "46 31 50 00",
        agencyEmail: "adm@roskilde.dk",
        postalAddress: "Dronning Margrethes Vej 14",
        postalCode: "4000",
        city: "Roskilde",
        agencyWebsiteUrl: "http://www.roskildebib.dk/",
        agencyCvrNumber: "29189404",
        agencyPNumber: "1003287869",
        agencyEanNumber: "5798007935030",
        pickupAgency: [
          {
            branchId: "726500",
            branchType: "H",
            branchName: [
              { value: "Roskilde Bibliotek", language: "dan" },
              { value: "Roskilde Libraries", language: "eng" },
            ],
            branchShortName: [
              { value: "Roskilde Bibliotekerne", language: "dan" },
              { value: "Roskilde Libraries", language: "eng" },
            ],
            branchPhone: "46 31 50 00",
            branchEmail: "voksen@roskilde.dk",
            branchIllEmail: "fjernlaan@roskilde.dk",
            branchIsAgency: false,
            postalAddress: "Dronning Margrethes Vej 14 Postbox 229",
            postalCode: "4000",
            city: "Roskilde",
            isil: "DK-726500",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/id%3d",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            registrationFormUrl: "https://roskildebib.dk/registration",
            registrationFormUrlText: "Bliv låner",
            userStatusUrl: "https://www.roskildebib.dk/",
            librarydkSupportEmail: "voksen@roskilde.dk",
            librarydkSupportPhone: "46 31 50 75",
            openingHours: [
              {
                value:
                  '<a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">Klik her</a>',
                language: "dan",
              },
              {
                value:
                  'Library opening hours can be seen <a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">here</a>',
                language: "eng",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            branchDomains: {
              domain: [
                "80.163.83.142",
                "91.236.123.101",
                "193.111.162.94",
                "212.130.49.211",
                "212.130.49.210",
                "87.48.97.203",
                "91.236.123.62",
                "83.94.230.137",
                "212.130.49.213",
                "212.130.49.202",
                "91.236.123.100",
                "212.130.49.218",
              ],
            },
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.64191, longitude: 12.087845 },
            headOfBranchName: "Stine Staunsager Larsen",
            headOfBranchTitle: "Leder af Bibliotek og Borgerservice",
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            routeNumber: "11",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
          {
            branchId: "726501",
            branchType: "b",
            branchName: [{ value: "Roskilde Bogbus", language: "dan" }],
            branchShortName: [{ value: "Roskilde Bogbus", language: "dan" }],
            branchPhone: "46 31 50 00",
            branchEmail: "bogbus@roskilde.dk",
            branchIllEmail: "fjernlaan@roskildebib.dk",
            branchIsAgency: false,
            postalAddress: "Dronning Margrethes Vej 14\r\n",
            postalCode: "4000",
            city: "Roskilde",
            isil: "DK-726501",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            userStatusUrl: "https://www.roskildebib.dk/",
            openingHours: [
              {
                value:
                  'Se bogbussens køreplan: \r\n<a href=" https://www.roskildebib.dk/nyheder/om-bibliotekerne/bogbussens-koereplan" TARGET="_blank">klik her</a>',
                language: "dan",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.64191, longitude: 12.087845 },
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
          {
            branchId: "726502",
            branchType: "f",
            branchName: [{ value: "Jyllinge Bibliotek", language: "dan" }],
            branchShortName: [{ value: "Jyllinge Bibliotek", language: "dan" }],
            branchPhone: "46 31 82 30",
            branchEmail: "bibnord@roskilde.dk",
            branchIllEmail: "fjernlaan@roskildebib.dk",
            branchIsAgency: false,
            postalAddress: "Bygaden 19 ",
            postalCode: "4040",
            city: "Jyllinge",
            isil: "DK-726502",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            userStatusUrl: "https://www.roskildebib.dk/",
            librarydkSupportEmail: "voksen@roskilde.dk",
            librarydkSupportPhone: "46 31 50 75",
            openingHours: [
              {
                value:
                  '<a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">Klik her</a>',
                language: "dan",
              },
              {
                value:
                  'Library opening hours can be seen <a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">here</a>',
                language: "eng",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.748496, longitude: 12.110293 },
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
          {
            branchId: "726503",
            branchType: "f",
            branchName: [{ value: "Gundsømagle Bibliotek", language: "dan" }],
            branchShortName: [{ value: "Gundsømagle", language: "dan" }],
            branchPhone: "46 31 81 10",
            branchEmail: "bibnord@roskilde.dk",
            branchIllEmail: "fjernlaan@roskildebib.dk",
            branchIsAgency: false,
            postalAddress: "Rosentorvet 8\r\nGundsømagle",
            postalCode: "4000",
            city: "Roskilde",
            isil: "DK-726503",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            userStatusUrl: "https://www.roskildebib.dk/",
            librarydkSupportEmail: "voksen@roskilde.dk",
            librarydkSupportPhone: "46 31 50 75",
            openingHours: [
              {
                value:
                  '<a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">Klik her</a>',
                language: "dan",
              },
              {
                value:
                  'Library opening hours can be seen <a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">here</a>',
                language: "eng",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.7371036, longitude: 12.1489658 },
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
          {
            branchId: "726504",
            branchType: "f",
            branchName: [{ value: "Ågerup Bibliotek", language: "dan" }],
            branchShortName: [{ value: "Ågerup Bibliotek", language: "dan" }],
            branchPhone: "46 31 81 07",
            branchEmail: "bibnord@roskilde.dk",
            branchIllEmail: "fjernlaan@roskildebib.dk",
            branchIsAgency: false,
            postalAddress: "Gundsølillevej 2 Ågerup",
            postalCode: "4000",
            city: "Roskilde",
            isil: "DK-726504",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            userStatusUrl: "https://www.roskildebib.dk/",
            librarydkSupportEmail: "voksen@roskilde.dk",
            librarydkSupportPhone: "46 31 50 75",
            openingHours: [
              {
                value:
                  '<a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">Klik her</a>',
                language: "dan",
              },
              {
                value:
                  'Library opening hours can be seen <a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">here</a>',
                language: "eng",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.693047, longitude: 12.1608129 },
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
          {
            branchId: "726505",
            branchType: "f",
            branchName: [
              { value: "Viby Bibliotek", language: "dan" },
              { value: "Viby Sj. Library", language: "eng" },
            ],
            branchShortName: [
              { value: "Viby Sj. Bibliotek", language: "dan" },
              { value: "Viby Sj. Library", language: "eng" },
            ],
            branchPhone: "46 31 73 72",
            branchEmail: "bibsyd@roskilde.dk",
            branchIllEmail: "fjernlaan@roskildebib.dk",
            branchIsAgency: false,
            postalAddress: "Søndergade 11",
            postalCode: "4130",
            city: "Viby Sj.",
            isil: "DK-726505",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            userStatusUrl: "https://www.roskildebib.dk/",
            librarydkSupportEmail: "voksen@roskilde.dk",
            librarydkSupportPhone: "46 31 50 75",
            openingHours: [
              {
                value:
                  '<a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">Klik her</a>',
                language: "dan",
              },
              {
                value:
                  'Library opening hours can be seen <a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">here</a>',
                language: "eng",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.547563, longitude: 12.02673 },
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
          {
            branchId: "726506",
            branchType: "f",
            branchName: [
              { value: "Gadstrup Bibliotek", language: "dan" },
              { value: "Gadstrup Library", language: "eng" },
            ],
            branchShortName: [
              { value: "Gadstrup", language: "dan" },
              { value: "Gadstrup Library", language: "eng" },
            ],
            branchPhone: "46 31 85 34",
            branchEmail: "bibsyd@roskilde.dk",
            branchIllEmail: "fjernlaan@roskildebib.dk",
            branchIsAgency: false,
            postalAddress: "Nyvej 40",
            postalCode: "4621",
            city: "Gadstrup",
            isil: "DK-726506",
            junction: "726500",
            branchCatalogueUrl: "https://www.roskildebib.dk/search",
            lookupUrl: "https://www.roskildebib.dk/search/ting/",
            branchWebsiteUrl: "https://www.roskildebib.dk",
            serviceDeclarationUrl: "https://www.roskildebib.dk/node/456",
            userStatusUrl: "https://www.roskildebib.dk/",
            librarydkSupportEmail: "voksen@roskilde.dk",
            librarydkSupportPhone: "46 31 50 75",
            openingHours: [
              {
                value:
                  '<a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">Klik her</a>',
                language: "dan",
              },
              {
                value:
                  'Library opening hours can be seen <a href="https://www.roskildebib.dk/biblioteker" TARGET="_blank">here</a>',
                language: "eng",
              },
            ],
            temporarilyClosed: false,
            pickupAllowed: true,
            ncipLookupUser: true,
            ncipRenewOrder: true,
            ncipCancelOrder: true,
            ncipUpdateOrder: true,
            dropOffBranch: "726500",
            dropOffName: "Roskilde Bibliotek",
            lastUpdated: "2023-07-12",
            isOclcRsLibrary: false,
            stateAndUniversityLibraryCopyService: true,
            geolocation: { latitude: 55.573022, longitude: 12.09189 },
            headOfInstitutionName: "Christian Lauersen",
            headOfInstitutionTitle: "Biblioteks- og borgerservicechef",
            nationalDeliveryService: true,
            willReceiveIll: true,
            vsnPostalAddr: "Dronning Margrethes Vej 14",
            vsnBPostNr: "4000",
            vsnBCity: "Roskilde",
            illServiceTekst:
              "https://centralbibliotek.dk/nyheder/cb-servicedeklaration-fjernlaan",
          },
        ],
      },
    ],
  }.library;

  const map = new Map();

  agencyHoldings.forEach((holding) => map.set(holding.responderId, holding));
  pickupAgencyList.forEach((vipAgency) =>
    map.set(vipAgency.agencyId, {
      ...map.get(vipAgency.agencyId),
      ...vipAgency,
    })
  );

  console.log("map: ", map);
}

function BranchDetails({ context }) {
  const { pids: pidsBeforeFilter, libraries: singleBranch } = context;

  const localHoldingsIds = uniq(
    singleBranch.holdingsItems.map((item) => item.localHoldingsId)
  );

  const pids = pidsBeforeFilter.filter((pid) =>
    localHoldingsIds.some((holdingsId) => pid.includes(holdingsId))
  );

  const { data: manifestationsData, isLoading: isManifestationsLoading } =
    useData(
      pids &&
        pids.length > 0 &&
        manifestationFragments.editionManifestations({
          pid: pids,
        })
    );
  const {
    flattenedGroupedSortedManifestations: manifestationsBeforeEnriching,
  } = manifestationMaterialTypeFactory(manifestationsData?.manifestations);

  const manifestations = manifestationsBeforeEnriching.map((manifestation) => {
    const itemsWithPid = singleBranch?.holdingsItems?.filter((item) =>
      manifestation?.pid?.includes(item?.localHoldingsId)
    );

    return {
      ...manifestation,
      locationInBranch: uniq(
        [
          itemsWithPid?.[0]?.department,
          itemsWithPid?.[0]?.location,
          itemsWithPid?.[0]?.subLocation,
        ].filter((e) => !!e)
      ).join(" > "),
      availability: singleBranch?.availability,
      availabilityById: singleBranch?.availabilityById?.find((ids) =>
        manifestation?.pid.includes(ids.localHoldingsId)
      ),
    };
  });

  const workId = manifestations?.map((manifestation) => {
    return manifestation.ownerWork?.workId;
  })?.[0];

  mergeAgencyHoldingsAndPickupAgency();

  return (
    <LocalizationsBase
      context={context}
      manifestations={manifestations}
      materialCardTemplate={templateForBranchDetails}
      subtitle={Translate({
        context: "localizations",
        label: "editions_on_shelf",
      })}
    >
      <LocalizationsBase.Information>
        <div className={cx(styles.reservationButton_container)}>
          <ReservationButton
            workId={workId}
            selectedPids={pids}
            singleManifestation={false}
            size={"medium"}
            overrideButtonText={Translate({
              context: "localizations",
              label: "order_to_here",
            })}
          />
        </div>
        <div className={cx(styles.fit_content)}>
          <Text type="text1">Åbningstider</Text>
          <IconLink
            iconPlacement="right"
            iconSrc={ExternalSvg}
            iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
            textType="type2"
            href={`${singleBranch.branchWebsiteUrl}/biblioteker`}
            target="_blank"
          >
            Klik her
          </IconLink>
        </div>
        <div className={cx(styles.fit_content)}>
          <Text type="text1">Adresse</Text>
          <Text type="text2">{singleBranch?.postalAddress}</Text>
          <Text type="text2">
            {singleBranch?.postalCode} {singleBranch?.city}
          </Text>
          <IconLink
            iconPlacement="right"
            iconSrc={ExternalSvg}
            iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
            textType="type2"
            href={`https://www.google.com/maps/place/${singleBranch?.postalAddress}+${singleBranch?.postalCode}+${singleBranch?.city}`}
            target="_blank"
          >
            Se i Google Maps
          </IconLink>
        </div>
        <div className={cx(styles.fit_content)}>
          <Text type="text1">Kontakt</Text>
          <Text type="text2">
            {"VipCore /1.0/api/findlibrary/{agencyId}/ -- branchPhone"}
          </Text>
          <Text type="text2">
            {"VipCore /1.0/api/findlibrary/{agencyId}/ -- branchEmail"}
          </Text>
          <Text type="text2">Svar på danbib-bestillinger hvor?????</Text>
        </div>
      </LocalizationsBase.Information>
    </LocalizationsBase>
  );
}

export default BranchDetails;
