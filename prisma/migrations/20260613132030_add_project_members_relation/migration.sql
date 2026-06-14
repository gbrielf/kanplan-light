-- CreateTable
CREATE TABLE "_MemberToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MemberToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MemberToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MemberToProject_AB_unique" ON "_MemberToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberToProject_B_index" ON "_MemberToProject"("B");
