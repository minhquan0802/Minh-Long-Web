/**
 * Ghi đè chữ tiếng Việt mặc định của Payload cho dễ hiểu với nhân viên.
 * Quy ước: mọi trạng thái nói theo góc nhìn "khách có thấy trên website không".
 *   "Trên website: Đang hiện"  ←  published
 *   "Trên website: Đang ẩn"    ←  draft
 * Giữ chữ trạng thái ngắn: nó nằm trong cột bảng danh sách.
 * Tra key gốc: node_modules/@payloadcms/translations/dist/languages/vi.js
 */
export const viOverrides = {
  general: {
    true: 'Có',
    false: 'Không',
    // Nút trên ô "Đường dẫn (slug)"
    unlock: 'Sửa',
    document: 'Mục',
    documents: 'Mục',
    documentModified: 'Có thay đổi chưa lưu',
    reloadDocument: 'Tải lại',
    documentLocked: 'Người khác đang sửa mục này',
    currentlyEditing:
      'đang sửa mục này. Nếu bạn sửa tiếp, họ sẽ bị dừng lại và có thể mất phần chưa lưu.',
    anotherUserTakenOver: 'Người khác đã chuyển sang sửa mục này.',
    documentOutOfDate: 'Mục này vừa được người khác cập nhật. Tải lại để xem bản mới nhất.',
    restoreAsPublished: 'Khôi phục và hiện lên website',
  },
  upload: {
    bulkUpload: 'Tải nhiều ảnh cùng lúc',
  },
  fields: {
    toggleBlock: 'Mở/thu gọn',
  },
  error: {
    unPublishingDocument: 'Lỗi: chưa ẩn được khỏi website, vui lòng thử lại.',
    autosaving: 'Lỗi: chưa tự lưu được, vui lòng bấm lưu lại.',
  },
  version: {
    // Trạng thái
    status: 'Trên website',
    published: 'Đang hiện',
    currentlyPublished: 'Đang hiện',
    draft: 'Đang ẩn',
    unpublished: 'Đang ẩn',
    changed: 'Có sửa đổi chưa đăng',
    draftHasPublishedVersion: 'Đang hiện (có sửa đổi chưa đăng)',
    previouslyPublished: 'Từng hiện trên website',
    previouslyDraft: 'Từng là bản nháp',
    currentPublishedVersion: 'Bản đang hiện trên website',
    currentDocumentStatus: 'Tình trạng hiện tại: {{docStatus}}',

    // Nút
    saveDraft: 'Lưu nháp (chưa hiện)',
    publishChanges: 'Lưu & hiện lên website',
    publish: 'Hiện lên website',
    publishing: 'Đang lưu...',
    unpublish: 'Ẩn khỏi website',
    unpublishing: 'Đang ẩn khỏi website...',
    confirmPublish: 'Hiện lên website',
    confirmUnpublish: 'Ẩn khỏi website',

    // Thông báo
    draftSavedSuccessfully: 'Đã lưu nháp. Khách chưa thấy thay đổi này.',
    unpublishedSuccessfully: 'Đã ẩn khỏi website. Bấm "Lưu & hiện lên website" để hiện lại.',
    aboutToUnpublish:
      'Ẩn mục này khỏi website? Dữ liệu vẫn được giữ nguyên, bạn có thể hiện lại bất cứ lúc nào.',
    aboutToUnpublishSelection: 'Ẩn tất cả {{label}} đã chọn khỏi website?',
    aboutToPublishSelection: 'Hiện tất cả {{label}} đã chọn lên website?',
    aboutToRevertToPublished: 'Bỏ các sửa đổi chưa đăng và quay về bản đang hiện trên website?',
    revertToPublished: 'Bỏ sửa đổi chưa đăng',
    revertUnsuccessful: 'Không quay lại được: mục này chưa từng hiện trên website.',

    // Lịch sử sửa (versions)
    versions: 'Lịch sử sửa',
    version: 'Bản lưu',
    versionID: 'Mã bản lưu',
    moreVersions: 'Xem thêm...',
    autosavedVersion: 'Bản tự động lưu',
    previousVersion: 'Bản trước',
    specificVersion: 'Bản lưu cụ thể',
    restoreThisVersion: 'Quay lại bản này',
    restoreAsDraft: 'Quay lại thành bản nháp',
    confirmVersionRestoration: 'Xác nhận quay lại bản này',
    aboutToRestore: 'Quay {{label}} về bản lưu lúc {{versionDate}}?',
    aboutToRestoreGlobal: 'Quay {{label}} về bản lưu lúc {{versionDate}}?',
    problemRestoringVersion: 'Không quay lại được bản này, vui lòng thử lại.',
    compareVersion: 'So sánh với bản:',
    compareVersions: 'So sánh các bản lưu',
    selectVersionToCompare: 'Chọn bản lưu để so sánh',
    showingVersionsFor: 'Đang xem lịch sử của:',
    noFurtherVersionsFound: 'Không còn bản lưu cũ hơn',
    versionCount_none: 'Chưa có bản lưu nào',
    versionCount_one: '{{count}} bản lưu',
    versionCount_many: '{{count}} bản lưu',
    versionCount_other: '{{count}} bản lưu',
    viewingVersion: 'Bản lưu của {{entityLabel}} {{documentTitle}}',
    viewingVersionGlobal: 'Bản lưu của {{entityLabel}}',
    viewingVersions: 'Lịch sử sửa của {{entityLabel}} {{documentTitle}}',
    viewingVersionsGlobal: 'Lịch sử sửa của {{entityLabel}}',
  },
}
