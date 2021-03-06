# Install hook code here
puts "Copying files..."
dir = "javascripts"
%w[jquery.rest_in_place.js jquery.rest_in_place_multiline.js mootools.rest_in_place.js rest_in_place.js].each do |js_file|
  dest_file = File.join(RAILS_ROOT, "public", dir, js_file)
  src_file = File.join(File.dirname(__FILE__) , dir, js_file)
  FileUtils.cp_r(src_file, dest_file)
end
puts "Files copied - Installation complete!"