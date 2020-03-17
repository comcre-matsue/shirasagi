class Translate::Api::MockTranslator
  attr_reader :site, :count

  def initialize(site, opts = {})
    @site = site
    @count = 0
    @processor = SS.config.translate.mock["processor"]
    @processor = opts[:processor] if opts[:processor]
  end

  def translate(contents, source, target, opts = {})
    site = opts[:site]

    if @processor == "loopback"
      translated = contents.dup
    else
      translated = contents.map { |content| "[#{target}:" + content + "]" }
    end

    @count = contents.map(&:size).sum

    if site
      site.translate_mock_api_request_count += 1
      site.translate_mock_api_request_word_count += @count
    end

    translated
  end
end
