import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("slipstreamArticle").title("Slipstream articles"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("job").title("Jobs"),
      S.divider(),
      S.documentTypeListItem("client").title("Clients"),
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("category").title("Categories"),
    ]);
