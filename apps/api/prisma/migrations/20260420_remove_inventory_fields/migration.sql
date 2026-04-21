-- DropIndex
DROP INDEX IF EXISTS "products_barcode_key";

-- DropIndex
DROP INDEX IF EXISTS "product_variants_barcode_key";

-- DropIndex
DROP INDEX IF EXISTS "product_variants_asin_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN IF EXISTS "barcode",
DROP COLUMN IF EXISTS "upc",
DROP COLUMN IF EXISTS "ean",
DROP COLUMN IF EXISTS "isbn",
DROP COLUMN IF EXISTS "trackQuantity",
DROP COLUMN IF EXISTS "quantity",
DROP COLUMN IF EXISTS "lowStockThreshold",
DROP COLUMN IF EXISTS "allowBackorder",
DROP COLUMN IF EXISTS "manageStock",
DROP COLUMN IF EXISTS "weight",
DROP COLUMN IF EXISTS "weightUnit",
DROP COLUMN IF EXISTS "dimensions",
DROP COLUMN IF EXISTS "requiresShipping",
DROP COLUMN IF EXISTS "shippingClass",
DROP COLUMN IF EXISTS "freeShipping",
DROP COLUMN IF EXISTS "taxable",
DROP COLUMN IF EXISTS "taxClass";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN IF EXISTS "barcode",
DROP COLUMN IF EXISTS "quantity",
DROP COLUMN IF EXISTS "weight",
DROP COLUMN IF EXISTS "dimensions",
DROP COLUMN IF EXISTS "height",
DROP COLUMN IF EXISTS "length",
DROP COLUMN IF EXISTS "width",
DROP COLUMN IF EXISTS "asin";
