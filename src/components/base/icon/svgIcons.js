import AdgangsplatformSvg from "@/public/icons/adgangsplatform.svg";
import AiSvg from "@/public/icons/ai.svg";
import ArrowDownSvg from "@/public/icons/arrowDown.svg";
import ArrowRightBlueSvg from "@/public/icons/arrowrightblue.svg";
import ArrowUpSvg from "@/public/icons/arrowUp.svg";
import AwardSvg from "@/public/icons/award.svg";
import BanSvg from "@/public/icons/ban.svg";
import CheckSvg from "@/public/icons/check.svg";
import CheckmarkSvg from "@/public/icons/checkmark.svg";
import CheckmarkBlueSvg from "@/public/icons/checkmark_blue.svg";
import ChevronSvg from "@/public/icons/chevron.svg";
import CloseSvg from "@/public/icons/close.svg";
import CloseGreySvg from "@/public/icons/close_grey.svg";
import CloseWhiteSvg from "@/public/icons/close_white.svg";
import ExclamationmarkSvg from "@/public/icons/exclamationmark.svg";
import ExpandSvg from "@/public/icons/expand.svg";
import HeartSvg from "@/public/icons/heart.svg";
import HeartFilledSvg from "@/public/icons/heart_filled.svg";
import HistorySvg from "@/public/icons/history.svg";
import MaximizeSvg from "@/public/icons/maximize.svg";
import MinimizeSvg from "@/public/icons/minimize.svg";
import MitIdSvg from "@/public/icons/MitID.svg";
import Ornament1Svg from "@/public/icons/ornament1.svg";
import Ornament1WhiteSvg from "@/public/icons/ornament1white.svg";
import PlaySvg from "@/public/icons/play.svg";
import QuestionmarkSvg from "@/public/icons/questionmark.svg";
import SearchSvg from "@/public/icons/search.svg";
import SettingsSvg from "@/public/icons/settings.svg";
import StarSvg from "@/public/icons/star.svg";
import ThumbsdownSvg from "@/public/icons/thumbsdown.svg";
import ThumbsupSvg from "@/public/icons/thumbsup.svg";
import Trash2Svg from "@/public/icons/trash-2.svg";
import TrashBlueSvg from "@/public/icons/trash_blue.svg";

export {
  AdgangsplatformSvg,
  AiSvg,
  ArrowDownSvg,
  ArrowRightBlueSvg,
  ArrowUpSvg,
  AwardSvg,
  BanSvg,
  CheckSvg,
  CheckmarkSvg,
  CheckmarkBlueSvg,
  ChevronSvg,
  CloseSvg,
  CloseGreySvg,
  CloseWhiteSvg,
  ExclamationmarkSvg,
  ExpandSvg,
  HeartFilledSvg,
  HeartSvg,
  HistorySvg,
  MaximizeSvg,
  MinimizeSvg,
  MitIdSvg,
  Ornament1Svg,
  Ornament1WhiteSvg,
  PlaySvg,
  QuestionmarkSvg,
  SearchSvg,
  SettingsSvg,
  StarSvg,
  ThumbsdownSvg,
  ThumbsupSvg,
  Trash2Svg,
  TrashBlueSvg,
};

const SVG_ICON_BY_NAME = {
  "adgangsplatform.svg": AdgangsplatformSvg,
  "ai.svg": AiSvg,
  "arrowDown.svg": ArrowDownSvg,
  "arrowUp.svg": ArrowUpSvg,
  "arrowrightblue.svg": ArrowRightBlueSvg,
  "award.svg": AwardSvg,
  "ban.svg": BanSvg,
  "check.svg": CheckSvg,
  "checkmark.svg": CheckmarkSvg,
  "checkmark_blue.svg": CheckmarkBlueSvg,
  "chevron.svg": ChevronSvg,
  "close.svg": CloseSvg,
  "close_grey.svg": CloseGreySvg,
  "close_white.svg": CloseWhiteSvg,
  "exclamationmark.svg": ExclamationmarkSvg,
  "expand.svg": ExpandSvg,
  "heart.svg": HeartSvg,
  "heart_filled.svg": HeartFilledSvg,
  "history.svg": HistorySvg,
  "maximize.svg": MaximizeSvg,
  "minimize.svg": MinimizeSvg,
  "MitID.svg": MitIdSvg,
  "ornament1.svg": Ornament1Svg,
  "ornament1white.svg": Ornament1WhiteSvg,
  "play.svg": PlaySvg,
  "questionmark.svg": QuestionmarkSvg,
  "search.svg": SearchSvg,
  "settings.svg": SettingsSvg,
  "star.svg": StarSvg,
  "thumbsdown.svg": ThumbsdownSvg,
  "thumbsup.svg": ThumbsupSvg,
  "trash-2.svg": Trash2Svg,
  "trash_blue.svg": TrashBlueSvg,
};

export function getSvgIconByName(name = "") {
  if (!name) {
    return null;
  }

  return SVG_ICON_BY_NAME[name] || SVG_ICON_BY_NAME[`${name}.svg`] || null;
}
