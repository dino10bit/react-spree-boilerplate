json.extract! master, :sku, :weight, :width, :height
json.in_stock master.in_stock?
json.images(master.images) do |img|
  json.extract! img, :position, :id
  json.mini_url img.attachment.url(:mini)
  json.small_url img.attachment.url(:small)
  json.product_url img.attachment.url(:product)
  json.large_url img.attachment.url(:large)
end
