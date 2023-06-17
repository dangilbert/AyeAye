import { AccountManageActionSheet } from "@rn-app/pages/account/components/AccountManageActionSheet";
import { registerSheet } from "react-native-actions-sheet";
import { CommentCreateSheet } from "../comment/CommentCreateSheet";

registerSheet("account-manage-sheet", AccountManageActionSheet);

registerSheet("comment-reply-sheet", CommentCreateSheet);

export {};
